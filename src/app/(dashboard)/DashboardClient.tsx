"use client";

import { useIsDesktop } from "@/hooks/use-media-query";
import DesktopDashboard from "./DesktopDashboard";
import MobileDashboard from "./MobileDashboard";
import type { DashboardStats } from "@/types/database";

interface DashboardClientProps {
    stats: DashboardStats;
}

export default function DashboardClient({ stats }: DashboardClientProps) {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
        return <DesktopDashboard stats={stats} />;
    }

    return <MobileDashboard stats={stats} />;
}
