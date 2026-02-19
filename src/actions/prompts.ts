"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPrompt(record: Record<string, unknown>) {
    const supabase = await createClient();

    // 1. Save to Supabase
    const { data, error } = await supabase
        .from("prompts")
        .insert(record)
        .select()
        .single();

    if (error) throw new Error(error.message);

    // 2. POST to n8n upsert webhook
    const webhookUrl = process.env.N8N_PROMPT_UPSERT_WEBHOOK;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } catch (err) {
            console.error("Failed to sync prompt to n8n:", err);
            // Don't throw — Supabase save succeeded, n8n sync is secondary
        }
    }

    revalidatePath("/prompts");
    return data;
}

export async function updatePrompt(
    id: string,
    record: Record<string, unknown>
) {
    const supabase = await createClient();

    // 1. Update in Supabase
    const { data, error } = await supabase
        .from("prompts")
        .update(record)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    // 2. POST to n8n upsert webhook
    const webhookUrl = process.env.N8N_PROMPT_UPSERT_WEBHOOK;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } catch (err) {
            console.error("Failed to sync prompt to n8n:", err);
        }
    }

    revalidatePath("/prompts");
    return data;
}

export async function deletePrompt(id: string) {
    const supabase = await createClient();

    // 1. Delete from Supabase
    const { error } = await supabase.from("prompts").delete().eq("id", id);

    if (error) throw new Error(error.message);

    // 2. POST to n8n delete webhook
    const webhookUrl = process.env.N8N_PROMPT_DELETE_WEBHOOK;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
        } catch (err) {
            console.error("Failed to sync prompt deletion to n8n:", err);
        }
    }

    revalidatePath("/prompts");
    return true;
}
