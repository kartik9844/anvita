import { getAll } from "@/actions/crud";
import ProductsClient from "./ProductsClient";
import type { Product } from "@/types/database";

export default async function ProductsPage() {
    const data = (await getAll("products")) as Product[];
    return <ProductsClient data={data} />;
}
