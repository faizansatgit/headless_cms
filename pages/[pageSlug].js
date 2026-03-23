import Head from "next/head";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getPageSlugs, getSinglePage } from "../lib/pages";

/** Next.js app routes — do not overlap with WP page slugs in getStaticPaths */
const RESERVED_PAGE_SLUGS = new Set([
    "shop",
    "cart",
    "checkout",
    "blog",
    "contact",
    "about",
]);

export async function getStaticProps({ params }) {
    const pageData = await getSinglePage(params.pageSlug);
    if (!pageData) {
        return { notFound: true };
    }

    return {
        props: {
            pageData,
        },
    };
}

export async function getStaticPaths() {
    const pageSlugs = await getPageSlugs();
    const paths = pageSlugs
        .filter((s) => s.slug && !RESERVED_PAGE_SLUGS.has(s.slug))
        .map((s) => ({
            params: {
                pageSlug: s.slug,
            },
        }));

    return {
        paths,
        fallback: false,
    };
}
export default function Page({ pageData }) {
    return (
        <>
            <Head>
                <title>{pageData.title}</title>
            </Head>
            <section className="bg-slate-700">
                <SiteHeader className="header-page z-10 relative" />
            </section>
            <section className="content-area py-8">
                <article>
                    <h1 className="text-6xl text-center text-slate-700 relative py-8">
                        {pageData.title}
                    </h1>
                    <div dangerouslySetInnerHTML={{ __html: pageData.content }} className="post-content container mx-auto lg:max-w-4xl" />
                </article>
            </section>
            <SiteFooter />
        </>
        
    );
}