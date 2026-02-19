"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Routing } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Routing, unknown>[] = [
    {
        accessorKey: "number",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-8 px-2"
            >
                Number
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            </Button>
        ),
    },
    {
        accessorKey: "purpose",
        header: "Purpose",
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
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    { name: "number", label: "Number", type: "text" },
    { name: "purpose", label: "Purpose", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
];

export default function RoutingClient({ data }: { data: Routing[] }) {
    return (
        <ResourcePageClient
            data={data}
            tableName="routing"
            title="Routing"
            description="Manage routing rules"
            columns={columns}
            fields={fields}
            searchKey="purpose"
            mobileTitleKey="purpose"
            mobileDisplayFields={[
                { label: "Number", key: "number" },
                { label: "Description", key: "description" },
            ]}
        />
    );
}
