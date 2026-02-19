"use client";

import { useIsDesktop } from "@/hooks/use-media-query";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

interface LayoutWrapperProps {
    children: React.ReactNode;
    userName?: string | null;
}

export default function LayoutWrapper({
    children,
    userName,
}: LayoutWrapperProps) {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
        return <DesktopLayout userName={userName}>{children}</DesktopLayout>;
    }

    return <MobileLayout userName={userName}>{children}</MobileLayout>;
}
