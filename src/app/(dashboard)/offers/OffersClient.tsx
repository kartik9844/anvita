"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Offer } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Offer, unknown>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-8 px-2"
            >
                Title
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            </Button>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="max-w-xs truncate block">
                {row.getValue("description") || "—"}
            </span>
        ),
    },
    {
        accessorKey: "pricing",
        header: "Pricing",
    },
    {
        accessorKey: "link",
        header: "Link",
        cell: ({ row }) => {
            const link = row.getValue("link") as string;
            return link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    Open
                </a>
            ) : (
                "—"
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
            new Date(row.getValue("created_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "pricing", label: "Pricing", type: "text" },
    { name: "link", label: "Link", type: "text", placeholder: "https://..." },
];

export default function OffersClient({ data }: { data: Offer[] }) {
    return (
        <ResourcePageClient
            data={data}
            tableName="offers"
            title="Offers"
            description="Manage promotional offers sent by the bot"
            columns={columns}
            fields={fields}
            searchKey="title"
            mobileTitleKey="title"
            mobileDisplayFields={[
                { label: "Pricing", key: "pricing" },
                { label: "Description", key: "description" },
            ]}
        />
    );
}
