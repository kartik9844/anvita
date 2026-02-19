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

interface DesktopDashboardProps {
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

export default function DesktopDashboard({ stats }: DesktopDashboardProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here&apos;s an overview of your WhatsApp automation.
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200/50 dark:border-emerald-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Conversations Today
                        </CardTitle>
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                            {stats.conversationsToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50 dark:border-blue-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Messages Today
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                            {stats.messagesToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200/50 dark:border-purple-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Messages This Month
                        </CardTitle>
                        <CalendarDays className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                            {stats.messagesThisMonth}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200/50 dark:border-amber-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Intent Types
                        </CardTitle>
                        <MessagesSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                            {stats.intentBreakdown.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Intent Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Intent Breakdown</CardTitle>
                        <CardDescription>Distribution of message intents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.intentBreakdown.length > 0 ? (
                                stats.intentBreakdown.map(({ intent, count }) => {
                                    const total = stats.intentBreakdown.reduce(
                                        (sum, i) => sum + i.count,
                                        0
                                    );
                                    const percentage =
                                        total > 0 ? Math.round((count / total) * 100) : 0;
                                    return (
                                        <div key={intent} className="flex items-center gap-3">
                                            <span className="text-sm text-muted-foreground w-20 truncate">
                                                {intentLabels[intent] || `Type ${intent}`}
                                            </span>
                                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium w-12 text-right">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No intent data available yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Recent Messages</CardTitle>
                        <CardDescription>Last 5 messages received</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentMessages.length > 0 ? (
                                stats.recentMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                                {(msg.user_name || msg.user_number || "?")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium truncate">
                                                    {msg.user_name || msg.user_number}
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] shrink-0">
                                                    {msg.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                                                {msg.user_question || "No message"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0" suppressHydrationWarning>
                                            <Clock className="h-3 w-3" />
                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No messages yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Navigation */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Quick Navigation</h2>
                <div className="grid grid-cols-4 gap-3">
                    {quickLinks.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div
                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                                    >
                                        <item.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
