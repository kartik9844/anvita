"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    MessageSquare,
    MessagesSquare,
    CalendarDays,
    Users,
    Tag,
    QrCode,
    Package,
    GraduationCap,
    Heart,
    FileText,
    Route,
    Clock,
} from "lucide-react";
import type { DashboardStats } from "@/types/database";

interface MobileDashboardProps {
    stats: DashboardStats;
}

const intentLabels: Record<number, string> = {
    0: "General",
    1: "Products",
    2: "Courses",
    3: "Healers",
    4: "Offers",
    5: "Codes",
    6: "Other",
};

const quickLinks = [
    { href: "/chats", label: "Chats", icon: MessageSquare, color: "from-blue-500 to-blue-600" },
    { href: "/offers", label: "Offers", icon: Tag, color: "from-orange-500 to-orange-600" },
    { href: "/codes", label: "Codes", icon: QrCode, color: "from-purple-500 to-purple-600" },
    { href: "/products", label: "Products", icon: Package, color: "from-pink-500 to-pink-600" },
    { href: "/courses", label: "Courses", icon: GraduationCap, color: "from-cyan-500 to-cyan-600" },
    { href: "/healers", label: "Healers", icon: Heart, color: "from-red-500 to-red-600" },
    { href: "/prompts", label: "Prompts", icon: FileText, color: "from-amber-500 to-amber-600" },
    { href: "/routing", label: "Routing", icon: Route, color: "from-indigo-500 to-indigo-600" },
];

export default function MobileDashboard({ stats }: MobileDashboardProps) {
    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Your automation overview
                </p>
            </div>

            {/* Stats Cards - 2 column grid on mobile */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200/50 dark:border-emerald-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs text-muted-foreground">Convos Today</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {stats.conversationsToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50 dark:border-blue-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs text-muted-foreground">Msgs Today</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {stats.messagesToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200/50 dark:border-purple-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <CalendarDays className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs text-muted-foreground">This Month</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {stats.messagesThisMonth}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200/50 dark:border-amber-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <MessagesSquare className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs text-muted-foreground">Intent Types</span>
                        </div>
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                            {stats.intentBreakdown.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Navigation - 4 column grid */}
            <div>
                <h2 className="text-base font-semibold mb-2">Quick Links</h2>
                <div className="grid grid-cols-4 gap-2">
                    {quickLinks.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Card className="hover:shadow-md transition-all cursor-pointer">
                                <CardContent className="flex flex-col items-center gap-1.5 p-3">
                                    <div
                                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                                    >
                                        <item.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-[11px] font-medium text-center">
                                        {item.label}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Messages */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Messages</CardTitle>
                    <CardDescription className="text-xs">Latest activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {stats.recentMessages.length > 0 ? (
                            stats.recentMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-accent/50"
                                >
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300" suppressHydrationWarning>
                                            {(msg.user_name || msg.user_number || "?")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-medium truncate">
                                                {msg.user_name || msg.user_number}
                                            </span>
                                            <Badge variant="secondary" className="text-[9px] h-4 px-1">
                                                {msg.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {msg.user_question || "No message"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0" suppressHydrationWarning>
                                        <Clock className="h-2.5 w-2.5" />
                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No messages yet
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Intent Breakdown */}
            {stats.intentBreakdown.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Intents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2.5">
                            {stats.intentBreakdown.map(({ intent, count }) => {
                                const total = stats.intentBreakdown.reduce(
                                    (sum, i) => sum + i.count,
                                    0
                                );
                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={intent} className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-16 truncate">
                                            {intentLabels[intent] || `Type ${intent}`}
                                        </span>
                                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium w-10 text-right">
                                            {percentage}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
