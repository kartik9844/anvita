"use client";

import { useState } from "react";
import ContactList from "@/components/chat/contact-list";
import ChatArea from "@/components/chat/chat-area";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Contact } from "@/types/database";

interface MobileChatsProps {
    contacts: Contact[];
}

export default function MobileChats({ contacts }: MobileChatsProps) {
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const selectedContact = contacts.find(
        (c) => c.user_number === selectedNumber
    );
    const { messages, loading } = useRealtimeMessages(selectedNumber);

    // Mobile: show either contact list OR chat, not both
    if (selectedNumber) {
        return (
            <div className="space-y-3">
                {/* Back Button + Contact Info */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedNumber(null)}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">
                            {selectedContact?.user_name || selectedNumber}
                        </h2>
                        {selectedContact?.user_name && (
                            <p className="text-[11px] text-muted-foreground">
                                {selectedNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="border rounded-xl overflow-hidden h-[calc(100vh-10rem)]">
                    <ChatArea
                        messages={messages}
                        loading={loading}
                        contactName={selectedContact?.user_name}
                        contactNumber={selectedNumber}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Chats</h1>
                <p className="text-sm text-muted-foreground">
                    WhatsApp conversations
                </p>
            </div>

            <div className="border rounded-xl overflow-hidden h-[calc(100vh-10rem)]">
                <ContactList
                    contacts={contacts}
                    selectedNumber={selectedNumber}
                    onSelect={setSelectedNumber}
                />
            </div>
        </div>
    );
}
