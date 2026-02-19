"use client";

import { ColumnDef } from "@tanstack/react-table";
import ResourcePageClient from "@/components/tables/resource-page-client";
import { FieldConfig } from "@/components/forms/resource-form-sheet";
import type { Course } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Course, unknown>[] = [
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
        accessorKey: "pricing",
        header: "Pricing",
    },
    {
        accessorKey: "starting_date",
        header: "Start Date",
        cell: ({ row }) => {
            const date = row.getValue("starting_date") as string;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
    {
        accessorKey: "batch",
        header: "Batch",
    },
    {
        accessorKey: "language",
        header: "Language",
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
];

const fields: FieldConfig[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "pricing", label: "Pricing", type: "text" },
    { name: "starting_date", label: "Starting Date", type: "date" },
    { name: "batch", label: "Batch", type: "text" },
    { name: "language", label: "Language", type: "text" },
    { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 6 weeks" },
    { name: "link", label: "Link", type: "text", placeholder: "https://..." },
];

export default function CoursesClient({ data }: { data: Course[] }) {
    return (
        <ResourcePageClient
            data={data}
            tableName="courses"
            title="Courses"
            description="Manage courses offered through the bot"
            columns={columns}
            fields={fields}
            searchKey="name"
            mobileTitleKey="name"
            mobileDisplayFields={[
                { label: "Pricing", key: "pricing" },
                { label: "Duration", key: "duration" },
            ]}
        />
    );
}
