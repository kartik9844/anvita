"use server";

import { createClient } from "@/lib/supabase/server";
import type { TableName } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function getAll(tableName: TableName) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getById(tableName: TableName, id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function createRecord(
    tableName: TableName,
    record: Record<string, unknown>
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/${tableName}`);
    return data;
}

export async function updateRecord(
    tableName: TableName,
    id: string,
    record: Record<string, unknown>
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(tableName)
        .update(record)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/${tableName}`);
    return data;
}

export async function deleteRecord(tableName: TableName, id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath(`/${tableName}`);
    return true;
}
