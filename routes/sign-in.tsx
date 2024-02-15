import { Handlers } from "$fresh/src/server/types.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { nanoid } from "nanoid";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, ctx) {
        const cookies = getCookies(req.headers);
        const authCookie = cookies["__padi_auth"];
        if (!authCookie) {
            return ctx.render();
        }

        const session = await kv.get(["session", cookies["__padi_auth"]]);
        const isAuthenticated = session.value !== null;
        if (isAuthenticated) {
            const headers = new Headers();
            headers.set("location", "/");
            return new Response(null, {
                status: 303, // See Other
                headers,
            });
        }

        return ctx.render();
    },
    async POST(req, ctx) {
        const form = await req.formData();
        const password = form.get("password")?.toString();
        console.log({ password })
        if (password !== Deno.env.get("PASSWORD")) {
            return new Response("Bad Request", { status: 400 });
        }

        const url = new URL(req.url);
        const headers = new Headers();
        const id = nanoid();
        // expires in 24 hours
        await kv.set(["session", id], id, { expireIn: 24 * 60 * 60 * 1000 });
        setCookie(headers, {
            name: "__padi_auth",
            value: id, // this should be a unique value for each session
            maxAge: 120,
            sameSite: "Lax", // this is important to prevent CSRF attacks
            domain: url.hostname,
            path: "/",
            secure: true,
        });
        headers.set("location", "/");
        return new Response(null, {
            status: 303, // See Other
            headers,
        });
    },
};

export default function SignInPage() {
    return (
        <div className="px-4 py-20 mx-auto">
            <div className="max-w-[800px] mx-auto">
                <a href="/" className="block text-center mb-2 text-slate-600 underline">
                    Back to Home
                </a>
                <h1 className="text-2xl text-3xl font-bold text-center capitalize">izin abangkuu 🔥</h1>
                <form className="flex items-center gap-3 pb-4 mx-auto mt-4 max-w-md" method="post">
                    <label className="input input-bordered flex items-center gap-2 flex-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            className="w-4 h-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password" className="grow" name="password" placeholder="Passwordnya bukan password123"
                        />
                    </label>
                    <button className="btn btn-neutral">
                        Izin
                    </button>
                </form>
            </div>
        </div>
    )
}