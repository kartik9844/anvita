"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createRecord, updateRecord } from "@/actions/crud";
import type { TableName } from "@/types/database";

export interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "textarea" | "date" | "number";
    required?: boolean;
    placeholder?: string;
}

interface ResourceFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tableName: TableName;
    fields: FieldConfig[];
    editData?: Record<string, unknown> | null;
    title: string;
    onSuccess: () => void;
    // Optional hook for custom save logic (used by Prompts for webhook)
    customSave?: (
        data: Record<string, unknown>,
        isEdit: boolean,
        id?: string
    ) => Promise<void>;
}

export default function ResourceFormSheet({
    open,
    onOpenChange,
    tableName,
    fields,
    editData,
    title,
    onSuccess,
    customSave,
}: ResourceFormSheetProps) {
    const [loading, setLoading] = useState(false);
    const isEdit = !!editData;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const record: Record<string, unknown> = {};

        fields.forEach((field) => {
            const value = formData.get(field.name);
            if (value !== null && value !== "") {
                record[field.name] = value;
            }
        });

        try {
            if (customSave) {
                await customSave(
                    record,
                    isEdit,
                    editData?.id as string | undefined
                );
            } else if (isEdit && editData?.id) {
                await updateRecord(tableName, editData.id as string, record);
            } else {
                await createRecord(tableName, record);
            }

            toast.success(
                isEdit
                    ? `${title} updated successfully`
                    : `${title} created successfully`
            );
            onOpenChange(false);
            onSuccess();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {isEdit ? `Edit ${title}` : `New ${title}`}
                    </SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? `Modify the ${title.toLowerCase()} details below.`
                            : `Fill in the details to create a new ${title.toLowerCase()}.`}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>
                                {field.label}
                                {field.required && (
                                    <span className="text-destructive ml-1">*</span>
                                )}
                            </Label>
                            {field.type === "textarea" ? (
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder || field.label}
                                    required={field.required}
                                    defaultValue={
                                        isEdit
                                            ? (editData?.[field.name] as string) || ""
                                            : ""
                                    }
                                    rows={4}
                                />
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                    placeholder={field.placeholder || field.label}
                                    required={field.required}
                                    defaultValue={
                                        isEdit
                                            ? (editData?.[field.name] as string) || ""
                                            : ""
                                    }
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </div>
                            ) : isEdit ? (
                                "Update"
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
