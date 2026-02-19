"use client";

import { useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import ResourceFormSheet, {
    FieldConfig,
} from "@/components/forms/resource-form-sheet";
import DeleteDialog from "@/components/forms/delete-dialog";
import { deleteRecord } from "@/actions/crud";
import { useIsDesktop } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { TableName } from "@/types/database";

interface ResourcePageClientProps<T extends Record<string, unknown>> {
    data: T[];
    tableName: TableName;
    title: string;
    description: string;
    columns: ColumnDef<T, unknown>[];
    fields: FieldConfig[];
    searchKey: string;
    mobileDisplayFields: { label: string; key: string }[];
    mobileTitleKey: string;
    customSave?: (
        data: Record<string, unknown>,
        isEdit: boolean,
        id?: string
    ) => Promise<void>;
    customDelete?: (id: string) => Promise<void>;
}

export default function ResourcePageClient<
    T extends Record<string, unknown>
>({
    data,
    tableName,
    title,
    description,
    columns,
    fields,
    searchKey,
    mobileDisplayFields,
    mobileTitleKey,
    customSave,
    customDelete,
}: ResourcePageClientProps<T>) {
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState<T | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEdit = useCallback((row: T) => {
        setEditData(row);
        setFormOpen(true);
    }, []);

    const handleAdd = useCallback(() => {
        setEditData(null);
        setFormOpen(true);
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            if (customDelete) {
                await customDelete(deleteId);
            } else {
                await deleteRecord(tableName, deleteId);
            }
            toast.success(`${title} deleted successfully`);
            setDeleteId(null);
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
    };

    // Add action column to the table
    const columnsWithActions: ColumnDef<T, unknown>[] = [
        ...columns,
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setDeleteId(row.original.id as string)}
                            className="text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableHiding: false,
        },
    ];

    if (isDesktop) {
        // DESKTOP VIEW
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>

                <DataTable
                    columns={columnsWithActions}
                    data={data}
                    searchKey={searchKey}
                    searchPlaceholder={`Search ${title.toLowerCase()}...`}
                    onAdd={handleAdd}
                    addLabel={`Add ${title.replace(/s$/, "")}`}
                />

                <ResourceFormSheet
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    tableName={tableName}
                    fields={fields}
                    editData={editData as Record<string, unknown> | null}
                    title={title.replace(/s$/, "")}
                    onSuccess={handleSuccess}
                    customSave={customSave}
                />

                <DeleteDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    onConfirm={handleDelete}
                    title={`this ${title.replace(/s$/, "").toLowerCase()}`}
                    loading={deleteLoading}
                />
            </div>
        );
    }

    // MOBILE VIEW
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Button
                    onClick={handleAdd}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </div>

            {/* Mobile card list */}
            <div className="space-y-2">
                {data.length > 0 ? (
                    data.map((item) => (
                        <Card
                            key={item.id as string}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleEdit(item)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate">
                                            {String(item[mobileTitleKey] || "Untitled")}
                                        </h3>
                                        <div className="mt-1 space-y-0.5">
                                            {mobileDisplayFields.slice(0, 2).map((field) => (
                                                <p
                                                    key={field.key}
                                                    className="text-xs text-muted-foreground truncate"
                                                >
                                                    <span className="font-medium">{field.label}:</span>{" "}
                                                    {String(item[field.key] || "—")}
                                                </p>
                                            ))}
                                        </div>
                                        <Badge variant="secondary" className="text-[9px] mt-1.5">
                                            {new Date(
                                                item.created_at as string
                                            ).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteId(item.id as string);
                                                }}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-sm">No {title.toLowerCase()} yet</p>
                        <p className="text-xs mt-1">
                            Tap &quot;Add&quot; to create your first entry
                        </p>
                    </div>
                )}
            </div>

            <ResourceFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                tableName={tableName}
                fields={fields}
                editData={editData as Record<string, unknown> | null}
                title={title.replace(/s$/, "")}
                onSuccess={handleSuccess}
                customSave={customSave}
            />

            <DeleteDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title={`this ${title.replace(/s$/, "").toLowerCase()}`}
                loading={deleteLoading}
            />
        </div>
    );
}
