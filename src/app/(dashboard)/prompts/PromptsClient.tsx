"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Prompt } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Webhook } from "lucide-react";
import { createPrompt, updatePrompt, deletePrompt } from "@/actions/prompts";
import { useCallback } from "react";

const columns: ColumnDef<Prompt, unknown>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-8 px-2"
            >
                Name
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-medium">{row.getValue("name")}</span>
                <Badge
                    variant="outline"
                    className="text-[9px] h-4 px-1 text-orange-600 border-orange-300"
                >
                    <Webhook className="h-2.5 w-2.5 mr-0.5" />
                    n8n sync
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "prompt",
        header: "Prompt Content",
        cell: ({ row }) => (
            <span className="max-w-md truncate block text-sm text-muted-foreground">
                {row.getValue("prompt")}
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
            new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
        accessorKey: "updated_at",
        header: "Updated",
        cell: ({ row }) =>
            new Date(row.getValue("updated_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    {
        name: "name",
        label: "Prompt Name",
        type: "text",
        required: true,
        placeholder: "e.g. system_prompt, welcome_message",
    },
    {
        name: "prompt",
        label: "Prompt Content",
        type: "textarea",
        required: true,
        placeholder: "Enter the full prompt text...",
    },
];

export default function PromptsClient({ data }: { data: Prompt[] }) {
    const handleCustomSave = useCallback(
        async (
            record: Record<string, unknown>,
            isEdit: boolean,
            id?: string
        ) => {
            if (isEdit && id) {
                await updatePrompt(id, record);
            } else {
                await createPrompt(record);
            }
        },
        []
    );

    const handleCustomDelete = useCallback(async (id: string) => {
        await deletePrompt(id);
    }, []);

    return (
        <ResourcePageClient
            data={data}
            tableName="prompts"
            title="Prompts"
            description="Manage AI prompts — changes auto-sync to n8n via webhooks"
            columns={columns}
            fields={fields}
            searchKey="name"
            mobileTitleKey="name"
            mobileDisplayFields={[{ label: "Prompt", key: "prompt" }]}
            customSave={handleCustomSave}
            customDelete={handleCustomDelete}
        />
    );
}
