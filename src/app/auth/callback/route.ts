import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get the user email
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                // Check if user is in admins table
                const { data: admin } = await supabase
                    .from("admins")
                    .select("id")
                    .eq("email", user.email)
                    .single();

                if (admin) {
                    // User is authorized
                    const forwardedHost = request.headers.get("x-forwarded-host");
                    const isLocalEnv = process.env.NODE_ENV === "development";

                    if (isLocalEnv) {
                        return NextResponse.redirect(`${origin}${next}`);
                    } else if (forwardedHost) {
                        return NextResponse.redirect(`https://${forwardedHost}${next}`);
                    } else {
                        return NextResponse.redirect(`${origin}${next}`);
                    }
                } else {
                    // User is NOT authorized — sign them out and redirect to login with error
                    await supabase.auth.signOut();
                    return NextResponse.redirect(
                        `${origin}/login?error=unauthorized`
                    );
                }
            }
        }
    }

    // Auth code error or missing
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
