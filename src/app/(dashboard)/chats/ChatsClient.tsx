"use client";

import { useIsDesktop } from "@/hooks/use-media-query";
import DesktopChats from "./DesktopChats";
import MobileChats from "./MobileChats";
import type { Contact } from "@/types/database";

interface ChatsClientProps {
    contacts: Contact[];
}

export default function ChatsClient({ contacts }: ChatsClientProps) {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
        return <DesktopChats contacts={contacts} />;
    }

    return <MobileChats contacts={contacts} />;
}
