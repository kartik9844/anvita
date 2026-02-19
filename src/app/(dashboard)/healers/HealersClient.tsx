"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Healer } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Healer, unknown>[] = [
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
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "phone_number", label: "Phone Number", type: "text" },
    { name: "location", label: "Location", type: "text" },
];

export default function HealersClient({ data }: { data: Healer[] }) {
    return (
        <ResourcePageClient
            data={data}
            tableName="healers"
            title="Healers"
            description="Manage healers in the system"
            columns={columns}
            fields={fields}
            searchKey="name"
            mobileTitleKey="name"
            mobileDisplayFields={[
                { label: "Phone", key: "phone_number" },
                { label: "Location", key: "location" },
            ]}
        />
    );
}
