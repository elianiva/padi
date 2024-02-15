import { Handlers, PageProps } from "$fresh/server.ts";
import { Course, courses } from "../../data/courses.ts";
import { getCookies } from "$std/http/cookie.ts";
import { nanoid } from "nanoid";

type StoredLink = {
    id: string;
    title: string;
    link: string;
};

const kv = await Deno.openKv();

export const handler: Handlers = {
    async GET(req, ctx) {
        const slug = ctx.params.slug as string;
        const course = courses.find((course) => course.slug === slug);

        const records = kv.list({ prefix: [slug] });
        const links = [];
        for await (const record of records) {
            links.push(record.value);
        }

        const cookies = getCookies(req.headers);
        const authCookie = cookies["__padi_auth"];
        if (!authCookie) {
            return ctx.render({ course, links, authenticated: false });
        }

        const session = await kv.get(["session", authCookie]);
        const authenticated = session.value !== null;

        return ctx.render({ course, links, authenticated });
    },
    async POST(req, ctx) {
        const form = await req.formData();

        const method = form.get("_method")?.toString();
        if (method === "DELETE") {
            const id = form.get("id")?.toString();
            if (!id) {
                return new Response("Bad Request", { status: 400 });
            }

            const slug = ctx.params.slug as string;
            await kv.delete([slug, id]);

            // Redirect to same page
            const headers = new Headers();
            headers.set("location", "/courses/" + slug);
            return new Response(null, {
                status: 303, // See Other
                headers,
            });
        }

        const title = form.get("title")?.toString();
        const link = form.get("link")?.toString();
        if (!title || !link) {
            return new Response("Bad Request", { status: 400 });
        }

        const slug = ctx.params.slug as string;
        const id = nanoid();
        await kv.set([slug, id], { id, title, link });

        // Redirect to same page
        const headers = new Headers();
        headers.set("location", "/courses/" + slug);
        return new Response(null, {
            status: 303, // See Other
            headers,
        });
    },
};

export default function CourseLinksPage({ data }: PageProps<{
    course: Course,
    links: StoredLink[],
    authenticated: boolean
}>) {
    return (
        <div className="px-4 py-20 mx-auto">
            <div className="max-w-[800px] mx-auto">
                <div class="flex flex-col items-center justify-center gap-2 mb-4">
                    <a href="/" class="text-slate-600 underline">
                        Back to Home
                    </a>
                    <h1 className="text-3xl font-bold text-center">
                        {data.course.title}
                    </h1>
                    <div class={`w-1/5 h-1 ${data.course.background}`}></div>
                </div>
                {data.authenticated && (
                    <form class="flex flex-col md:flex-row items-center gap-3 mb-4" method="post">
                        <input
                            type="text" name="title" placeholder="Title"
                            className="input input-bordered w-full md:flex-1"
                        />
                        <input
                            type="url" name="link" placeholder="Link" className="input input-bordered w-full md:flex-1"
                        />
                        <button class="btn btn-neutral">Submit</button>
                    </form>
                )}
                <div className="flex flex-col gap-3 pb-4 mx-auto">
                    {
                        data.links.map((link) => (
                            <div class="flex items-start gap-2">
                                <div
                                    className="flex-1 flex flex-col items-start gap-2 px-4 py-3 border border-slate-300 bg-white"
                                >
                                    <span class="capitalize font-semibold text-slate-700 whitespace-wrap">
                                        {link.title}
                                    </span>
                                    <a
                                        target="_blank"
                                        href={link.link}
                                        class="text-slate-500 text-sm underline max-w-[32ch] md:max-w-[60ch] truncate whitespace-wrap"
                                    >
                                        {link.link}
                                    </a>
                                </div>
                                {data.authenticated && (
                                    <form method="post">
                                        <input type="hidden" value="DELETE" name="_method" />
                                        <input type="hidden" value={link.id} name="id" />
                                        <button
                                            class="btn btn-error btn-square btn-sm btn-outline text-xl hover:!text-white bg-white"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M7.615 20q-.666 0-1.14-.475Q6 19.051 6 18.385V6h-.5q-.213 0-.356-.144T5 5.499q0-.212.144-.356Q5.288 5 5.5 5H9q0-.31.23-.54q.23-.23.54-.23h4.46q.31 0 .54.23q.23.23.23.54h3.5q.213 0 .356.144q.144.144.144.357q0 .212-.144.356Q18.713 6 18.5 6H18v12.385q0 .666-.475 1.14q-.474.475-1.14.475zm2.693-3q.213 0 .356-.144q.144-.144.144-.356v-8q0-.213-.144-.356T10.307 8q-.213 0-.356.144t-.143.356v8q0 .213.144.356t.356.144m3.385 0q.213 0 .356-.144t.143-.356v-8q0-.213-.144-.356T13.692 8q-.213 0-.356.144q-.144.144-.144.356v8q0 .213.144.356t.357.144"
                                                ></path>
                                            </svg>
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}