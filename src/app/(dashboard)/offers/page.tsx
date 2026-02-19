import { getAll } from "@/actions/crud";
import OffersClient from "./OffersClient";
import type { Offer } from "@/types/database";

export default async function OffersPage() {
    const data = (await getAll("offers")) as Offer[];
    return <OffersClient data={data} />;
}
