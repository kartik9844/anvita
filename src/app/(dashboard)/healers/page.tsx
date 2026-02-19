import { getAll } from "@/actions/crud";
import HealersClient from "./HealersClient";
import type { Healer } from "@/types/database";

export default async function HealersPage() {
    const data = (await getAll("healers")) as Healer[];
    return <HealersClient data={data} />;
}
