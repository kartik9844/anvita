"use server";

import { createClient } from "@/lib/supabase/server";
import type { Contact, Message } from "@/types/database";

export async function getContacts(): Promise<Contact[]> {
    const supabase = await createClient();

    // Get all messages ordered by latest first
    const { data: messages, error } = await supabase
        .from("messages")
        .select("user_number, user_name, user_question, anvita_reply, created_at")
        .order("created_at", { ascending: false });

    if (error || !messages) return [];

    // Group by user_number and get latest message + count
    const contactMap = new Map<string, Contact>();

    messages.forEach((msg) => {
        if (!contactMap.has(msg.user_number)) {
            contactMap.set(msg.user_number, {
                user_number: msg.user_number,
                user_name: msg.user_name,
                last_message: msg.user_question || msg.anvita_reply || null,
                last_message_time: msg.created_at,
                message_count: 1,
            });
        } else {
            const existing = contactMap.get(msg.user_number)!;
            existing.message_count += 1;
            // Keep the name if we find one
            if (!existing.user_name && msg.user_name) {
                existing.user_name = msg.user_name;
            }
        }
    });

    return Array.from(contactMap.values());
}

export async function getMessages(userNumber: string): Promise<Message[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_number", userNumber)
        .order("created_at", { ascending: true });

    if (error) return [];
    return data || [];
}
