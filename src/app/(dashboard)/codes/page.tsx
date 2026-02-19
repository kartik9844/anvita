import { getAll } from "@/actions/crud";
import CodesClient from "./CodesClient";
import type { Code } from "@/types/database";

export default async function CodesPage() {
    const data = (await getAll("codes")) as Code[];
    return <CodesClient data={data} />;
}
