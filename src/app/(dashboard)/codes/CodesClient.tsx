"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Code } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Code, unknown>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-8 px-2"
            >
                Code
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-mono">
                {row.getValue("code")}
            </Badge>
        ),
    },
    {
        accessorKey: "message",
        header: "Message / Reply",
        cell: ({ row }) => (
            <span className="max-w-md truncate block text-sm">
                {row.getValue("message")}
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
            new Date(row.getValue("created_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    {
        name: "code",
        label: "Code",
        type: "text",
        required: true,
        placeholder: "e.g. CN, HLR",
    },
    {
        name: "message",
        label: "Message / Reply",
        type: "textarea",
        required: true,
        placeholder: "The reply or payment link sent when this code is received",
    },
];

export default function CodesClient({ data }: { data: Code[] }) {
    return (
        <ResourcePageClient
            data={data}
            tableName="codes"
            title="Codes"
            description="Marketing quick-reply codes for the WhatsApp bot"
            columns={columns}
            fields={fields}
            searchKey="code"
            mobileTitleKey="code"
            mobileDisplayFields={[{ label: "Message", key: "message" }]}
        />
    );
}
