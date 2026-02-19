import { getAll } from "@/actions/crud";
import CoursesClient from "./CoursesClient";
import type { Course } from "@/types/database";

export default async function CoursesPage() {
    const data = (await getAll("courses")) as Course[];
    return <CoursesClient data={data} />;
}
