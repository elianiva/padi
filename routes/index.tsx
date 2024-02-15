import { courses } from "../data/courses.ts";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, ctx) {
        const cookies = getCookies(req.headers);
        const authCookie = cookies["__padi_auth"];
        if (!authCookie) {
            return ctx.render({
                authenticated: false,
            });
        }

        const session = await kv.get(["session", authCookie]);
        const isAuthenticated = session.value !== null;
        const headers = new Headers();
        if (!isAuthenticated) {
            // remove the previous cookie if it has been expired
            setCookie(headers, {
                name: "__padi_auth",
                value: "",
                maxAge: 0,
                path: "/",
                secure: true,
            });
        }

        return ctx.render({
            authenticated: session.value !== null,
        });
    },
}

export default function Home({ data }: PageProps<{ authenticated: boolean }>) {
    return (
        <div class="px-4 py-20 mx-auto">
            <div class="max-w-[800px] mx-auto">
                <h1 class="text-2xl text-3xl font-bold text-center mb-4 capitalize">Ilmu Padi Abangkuhh🌾🌾👊🏻💥🔥</h1>
                {!data.authenticated && (
                    <a className="block text-center text-slate-500 underline capitalize" href="/sign-in">
                        izin abangkuu 🔥
                    </a>
                )}
                <div class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-3 pb-4 mx-auto mt-8">
                    {
                        courses.map((course) => (
                            <a
                                href={`/courses/${course.slug}`}
                                className={`flex items-center gap-2 justify-start btn btn-outline`}
                            >
                                <div class={`w-4 h-4 ${course.background}`}></div>
                                {course.title}
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
