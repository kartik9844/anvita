"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types/database";

export function useRealtimeMessages(userNumber: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch initial messages
    const fetchMessages = useCallback(async () => {
        if (!userNumber) {
            setMessages([]);
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase
            .from("messages")
            .select("*")
            .eq("user_number", userNumber)
            .order("created_at", { ascending: true });

        setMessages(data || []);
        setLoading(false);
    }, [userNumber]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Subscribe to realtime
    useEffect(() => {
        if (!userNumber) return;

        const supabase = createClient();
        const channel = supabase
            .channel(`messages-${userNumber}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `user_number=eq.${userNumber}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const updatedMessage = payload.new as Message;
                    if (updatedMessage.user_number === userNumber) {
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === updatedMessage.id ? updatedMessage : msg
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userNumber]);

    return { messages, loading };
}
