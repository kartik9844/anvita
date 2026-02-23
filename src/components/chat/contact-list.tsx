"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { Contact } from "@/types/database";

interface ContactListProps {
    contacts: Contact[];
    selectedNumber: string | null;
    onSelect: (number: string) => void;
}

export default function ContactList({
    contacts,
    selectedNumber,
    onSelect,
}: ContactListProps) {
    const [search, setSearch] = useState("");

    const filtered = contacts.filter((c) => {
        const term = search.toLowerCase();
        return (
            c.user_number.toLowerCase().includes(term) ||
            (c.user_name && c.user_name.toLowerCase().includes(term))
        );
    });

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Search */}
            <div className="p-3 border-b shrink-0">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Contact List */}
            <ScrollArea className="flex-1 min-h-0">
                {filtered.length > 0 ? (
                    <div className="divide-y">
                        {filtered.map((contact) => (
                            <button
                                key={contact.user_number}
                                onClick={() => onSelect(contact.user_number)}
                                className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent ${selectedNumber === contact.user_number
                                    ? "bg-accent border-l-2 border-emerald-500"
                                    : ""
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                        {(contact.user_name || contact.user_number)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium truncate">
                                            {contact.user_name || contact.user_number}
                                        </span>
                                        {contact.last_message_time && (
                                            <span className="text-[10px] text-muted-foreground shrink-0">
                                                {new Date(contact.last_message_time).toLocaleDateString(
                                                    [],
                                                    { month: "short", day: "numeric" }
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className="text-xs text-muted-foreground truncate">
                                            {contact.last_message || "No messages"}
                                        </p>
                                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                                            {contact.message_count}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {search ? "No contacts found" : "No conversations yet"}
                        </p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
