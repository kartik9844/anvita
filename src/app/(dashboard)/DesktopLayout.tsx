"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    MessageSquare,
    Tag,
    QrCode,
    Package,
    GraduationCap,
    Heart,
    FileText,
    Route,
    LogOut,
} from "lucide-react";
import { signOut } from "@/actions/auth";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chats", label: "Chats", icon: MessageSquare },
    { href: "/offers", label: "Offers", icon: Tag },
    { href: "/codes", label: "Codes", icon: QrCode },
    { href: "/products", label: "Products", icon: Package },
    { href: "/courses", label: "Courses", icon: GraduationCap },
    { href: "/healers", label: "Healers", icon: Heart },
    { href: "/prompts", label: "Prompts", icon: FileText },
    { href: "/routing", label: "Routing", icon: Route },
];

interface DesktopLayoutProps {
    children: React.ReactNode;
    userName?: string | null;
}

export default function DesktopLayout({
    children,
    userName,
}: DesktopLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mr-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Anvita</span>
                    </Link>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                    {userName ? userName.charAt(0).toUpperCase() : "A"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium hidden xl:block">
                                {userName || "Admin"}
                            </span>
                        </div>
                        <form action={signOut}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                type="submit"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Left Sidebar - Always Visible */}
                <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 border-r bg-background/50 shrink-0">
                    <ScrollArea className="h-full py-4">
                        <nav className="space-y-1 px-3">
                            {navItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" &&
                                        pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </ScrollArea>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-3.5rem)]">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
