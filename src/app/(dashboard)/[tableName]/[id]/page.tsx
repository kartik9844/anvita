import { getById } from "@/actions/crud";
import type { TableName } from "@/types/database";
import RecordDetailClient from "./RecordDetailClient";
import { notFound } from "next/navigation";

const VALID_TABLES: TableName[] = [
    "offers",
    "codes",
    "products",
    "courses",
    "healers",
    "prompts",
    "routing",
];

// Human-readable labels for every column across all tables
const FIELD_LABELS: Record<string, string> = {
    id: "ID",
    name: "Name",
    title: "Title",
    code: "Code",
    message: "Message",
    prompt: "Prompt Content",
    description: "Description",
    pricing: "Pricing",
    link: "Link",
    offer_id: "Offer ID",
    phone_number: "Phone Number",
    location: "Location",
    number: "Number",
    purpose: "Purpose",
    starting_date: "Starting Date",
    batch: "Batch",
    language: "Language",
    duration: "Duration",
    created_by: "Created By",
    created_at: "Created At",
    updated_at: "Updated At",
};

// Display names for table titles
const TABLE_TITLES: Record<string, string> = {
    offers: "Offer",
    codes: "Code",
    products: "Product",
    courses: "Course",
    healers: "Healer",
    prompts: "Prompt",
    routing: "Routing",
};

export default async function RecordDetailPage({
    params,
}: {
    params: Promise<{ tableName: string; id: string }>;
}) {
    const { tableName, id } = await params;

    if (!VALID_TABLES.includes(tableName as TableName)) {
        notFound();
    }

    let record;
    try {
        record = await getById(tableName as TableName, id);
    } catch {
        notFound();
    }

    if (!record) {
        notFound();
    }

    return (
        <RecordDetailClient
            record={record}
            tableName={tableName as TableName}
            tableTitle={TABLE_TITLES[tableName] || tableName}
            fieldLabels={FIELD_LABELS}
        />
    );
}
