"use client";

import { useState } from "react";
import ContactList from "@/components/chat/contact-list";
import ChatArea from "@/components/chat/chat-area";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import type { Contact } from "@/types/database";

interface DesktopChatsProps {
    contacts: Contact[];
}

export default function DesktopChats({ contacts }: DesktopChatsProps) {
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const selectedContact = contacts.find(
        (c) => c.user_number === selectedNumber
    );
    const { messages, loading } = useRealtimeMessages(selectedNumber);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Chats</h1>
                <p className="text-muted-foreground">
                    Monitor live WhatsApp conversations
                </p>
            </div>

            <div className="flex border rounded-xl overflow-hidden bg-background shadow-sm h-[calc(100vh-12rem)]">
                {/* Contact sidebar */}
                <div className="w-80 border-r shrink-0">
                    <ContactList
                        contacts={contacts}
                        selectedNumber={selectedNumber}
                        onSelect={setSelectedNumber}
                    />
                </div>

                {/* Chat area */}
                <div className="flex-1">
                    <ChatArea
                        messages={messages}
                        loading={loading}
                        contactName={selectedContact?.user_name}
                        contactNumber={selectedNumber}
                    />
                </div>
            </div>
        </div>
    );
}
