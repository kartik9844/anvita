import { getContacts } from "@/actions/chats";
import ChatsClient from "./ChatsClient";

export default async function ChatsPage() {
    const contacts = await getContacts();

    return <ChatsClient contacts={contacts} />;
}
