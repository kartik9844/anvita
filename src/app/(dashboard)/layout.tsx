import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import LayoutWrapper from "./LayoutWrapper";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <LayoutWrapper userName={user.adminName}>
            {children}
        </LayoutWrapper>
    );
}
