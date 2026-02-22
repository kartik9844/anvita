"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pencil, Trash2, Calendar, User } from "lucide-react";
import ResourceFormSheet, {
    FieldConfig,
} from "@/components/forms/resource-form-sheet";
import DeleteDialog from "@/components/forms/delete-dialog";
import { deleteRecord } from "@/actions/crud";
import { toast } from "sonner";
import type { TableName } from "@/types/database";

// Field configs per table — used when opening the edit sheet
const TABLE_FIELD_CONFIGS: Record<TableName, FieldConfig[]> = {
    offers: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "pricing", label: "Pricing", type: "text" },
        { name: "link", label: "Link", type: "text" },
    ],
    codes: [
        { name: "code", label: "Code", type: "text", required: true },
        { name: "message", label: "Message", type: "textarea", required: true },
    ],
    products: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "offer_id", label: "Offer ID", type: "text" },
        { name: "pricing", label: "Pricing", type: "text" },
        { name: "link", label: "Link", type: "text" },
    ],
    courses: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "pricing", label: "Pricing", type: "text" },
        { name: "starting_date", label: "Starting Date", type: "date" },
        { name: "batch", label: "Batch", type: "text" },
        { name: "language", label: "Language", type: "text" },
        { name: "duration", label: "Duration", type: "text" },
        { name: "link", label: "Link", type: "text" },
    ],
    healers: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "phone_number", label: "Phone Number", type: "text" },
        { name: "location", label: "Location", type: "text" },
    ],
    prompts: [
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
    ],
    routing: [
        { name: "number", label: "Number", type: "text" },
        { name: "purpose", label: "Purpose", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
    ],
};

// Keys to exclude from the detail view (shown separately or irrelevant)
const HIDDEN_KEYS = ["id"];

// Keys that should be rendered as dates
const DATE_KEYS = ["created_at", "updated_at", "starting_date"];

interface RecordDetailClientProps {
    record: Record<string, unknown>;
    tableName: TableName;
    tableTitle: string;
    fieldLabels: Record<string, string>;
}

export default function RecordDetailClient({
    record,
    tableName,
    tableTitle,
    fieldLabels,
}: RecordDetailClientProps) {
    const router = useRouter();
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fields = TABLE_FIELD_CONFIGS[tableName] || [];

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteRecord(tableName, record.id as string);
            toast.success(`${tableTitle} deleted successfully`);
            router.push(`/${tableName}`);
            router.refresh();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to delete";
            toast.error(message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSuccess = () => {
        router.refresh();
        setFormOpen(false);
    };

    const formatValue = (key: string, value: unknown): string => {
        if (value === null || value === undefined || value === "") return "—";
        if (DATE_KEYS.includes(key)) {
            return new Date(value as string).toLocaleString();
        }
        return String(value);
    };

    // Separate metadata fields from content fields
    const metadataKeys = ["created_at", "updated_at", "created_by"];
    const contentEntries = Object.entries(record).filter(
        ([key]) => !HIDDEN_KEYS.includes(key) && !metadataKeys.includes(key)
    );
    const metadataEntries = Object.entries(record).filter(([key]) =>
        metadataKeys.includes(key)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => router.push(`/${tableName}`)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {tableTitle} Details
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono mt-0.5">
                            ID: {record.id as string}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setFormOpen(true)}
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Content Card */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Record Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {contentEntries.map(([key, value]) => {
                            const isLongText =
                                typeof value === "string" && value.length > 100;
                            return (
                                <div
                                    key={key}
                                    className={
                                        isLongText
                                            ? "md:col-span-2"
                                            : ""
                                    }
                                >
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        {fieldLabels[key] || key.replace(/_/g, " ")}
                                    </p>
                                    {isLongText ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-md p-3">
                                            {formatValue(key, value)}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-medium">
                                            {formatValue(key, value)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {metadataEntries.map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                {key === "created_by" ? (
                                    <User className="h-3.5 w-3.5" />
                                ) : (
                                    <Calendar className="h-3.5 w-3.5" />
                                )}
                                <span className="font-medium">
                                    {fieldLabels[key] || key.replace(/_/g, " ")}:
                                </span>
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {formatValue(key, value)}
                                </Badge>
                                <Separator orientation="vertical" className="h-4 last:hidden" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Sheet */}
            <ResourceFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                tableName={tableName}
                fields={fields}
                editData={record}
                title={tableTitle}
                onSuccess={handleSuccess}
            />

            {/* Delete Dialog */}
            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                title={`this ${tableTitle.toLowerCase()}`}
                loading={deleteLoading}
            />
        </div>
    );
}
