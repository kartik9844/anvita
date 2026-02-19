"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Message } from "@/types/database";

interface ChatAreaProps {
    messages: Message[];
    loading: boolean;
    contactName?: string | null;
    contactNumber?: string | null;
}

export default function ChatArea({
    messages,
    loading,
    contactName,
    contactNumber,
}: ChatAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!contactNumber) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Choose a contact from the list to view their chat
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <div className="border-b px-4 py-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <div className="flex-1 p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                        >
                            <Skeleton className="h-16 w-64 rounded-2xl" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="border-b px-4 py-3 bg-background/50">
                <h3 className="text-sm font-semibold">
                    {contactName || contactNumber}
                </h3>
                {contactName && (
                    <p className="text-xs text-muted-foreground">{contactNumber}</p>
                )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3 max-w-3xl mx-auto">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="space-y-2">
                                {/* User message (right, blue) */}
                                {msg.user_question && (
                                    <div className="flex justify-end">
                                        <div className="max-w-[75%] bg-blue-500 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-sm">
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {msg.user_question}
                                            </p>
                                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                                <span className="text-[10px] text-blue-100">
                                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[8px] h-3 px-1 bg-blue-400/30 text-blue-100 border-0"
                                                >
                                                    {msg.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Anvita reply (left, gray) */}
                                {msg.anvita_reply && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[75%] bg-accent px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm">
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {msg.anvita_reply}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-[8px] h-3 px-1"
                                                >
                                                    Anvita
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No messages in this conversation
                            </p>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
