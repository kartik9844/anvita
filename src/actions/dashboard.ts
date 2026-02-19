"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/types/database";

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();

    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    ).toISOString();
    const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    ).toISOString();

    // Conversations today (distinct user_number)
    const { data: todayMessages } = await supabase
        .from("messages")
        .select("user_number")
        .gte("created_at", todayStart);

    const uniqueNumbers = new Set(
        todayMessages?.map((m) => m.user_number) || []
    );
    const conversationsToday = uniqueNumbers.size;

    // Messages today
    const messagesToday = todayMessages?.length || 0;

    // Messages this month
    const { count: messagesThisMonth } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart);

    // Intent breakdown
    const { data: intentData } = await supabase
        .from("messages")
        .select("intent_type")
        .not("intent_type", "is", null);

    const intentMap = new Map<number, number>();
    intentData?.forEach((m) => {
        if (m.intent_type !== null) {
            intentMap.set(
                m.intent_type,
                (intentMap.get(m.intent_type) || 0) + 1
            );
        }
    });

    const intentBreakdown = Array.from(intentMap.entries()).map(
        ([intent, count]) => ({ intent, count })
    );

    // Recent messages (last 5)
    const { data: recentMessages } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    return {
        conversationsToday,
        messagesToday,
        messagesThisMonth: messagesThisMonth || 0,
        intentBreakdown,
        recentMessages: recentMessages || [],
    };
}
