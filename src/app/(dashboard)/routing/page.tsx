import { getAll } from "@/actions/crud";
import RoutingClient from "./RoutingClient";
import type { Routing } from "@/types/database";

export default async function RoutingPage() {
    const data = (await getAll("routing")) as Routing[];
    return <RoutingClient data={data} />;
}
