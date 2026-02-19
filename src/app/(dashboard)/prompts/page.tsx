import { getAll } from "@/actions/crud";
import PromptsClient from "./PromptsClient";
import type { Prompt } from "@/types/database";

export default async function PromptsPage() {
    const data = (await getAll("prompts")) as Prompt[];
    return <PromptsClient data={data} />;
}
