"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
    Menu,
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

interface MobileLayoutProps {
    children: React.ReactNode;
    userName?: string | null;
}

export default function MobileLayout({
    children,
    userName,
}: MobileLayoutProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-4">
                    {/* Hamburger */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex items-center gap-2 p-4 border-b">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-lg">Anvita</span>
                            </div>

                            <ScrollArea className="h-[calc(100vh-8rem)]">
                                <nav className="space-y-1 p-3">
                                    {navItems.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/" &&
                                                pathname.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
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

                            {/* Bottom user section */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-background">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                            {userName ? userName.charAt(0).toUpperCase() : "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium flex-1 truncate">
                                        {userName || "Admin"}
                                    </span>
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
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-bold text-base">Anvita</span>
                    </Link>

                    <div className="flex-1" />

                    {/* Right side */}
                    <ModeToggle />
                </div>
            </header >

            {/* Main Content */}
            < main className="p-4" > {children}</main >
        </div >
    );
}
