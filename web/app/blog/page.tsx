import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import blogsData from "@/content/blogs.json";

export const metadata = buildMetadata({
  title: "Blog — Practical engineering and AI systems insights",
  description:
    "Engineering insights, architecture guides, and practical playbooks on software development and AI systems for business.",
  path: "/blog/",
});

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  read_time?: string;
}

export default function BlogListingPage() {
  const posts = blogsData as BlogPost[];

  return (
    <Section tone="white" className="pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="flex flex-col gap-16">
        <div className="flex max-w-3xl flex-col items-start gap-4">
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            Engineering & Strategy
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Insights from production.
          </h1>
          <p className="text-body text-ink-70 leading-relaxed">
            Plain words on building software, deploying AI workflows, and running business operations. No hype.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const dateStr = new Date(post.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const cover = post.cover_image?.startsWith("/")
              ? post.cover_image
              : post.cover_image
              ? `/${post.cover_image}`
              : "/assets/blog-cover-1.jpg";

            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-3 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink hover:shadow-2xl"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={cover}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between text-xs text-ink-70">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium uppercase text-neutral-700">
                        {post.category || "Engineering"}
                      </span>
                      <span>{dateStr}</span>
                    </div>

                    <h2 className="text-h3 font-medium text-ink tracking-tight">
                      <Link href={`/blog/${post.slug}/`} className="hover:text-black">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-small text-ink-70 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 p-5 pt-3 text-small font-medium text-ink">
                  <span className="text-xs text-neutral-500">{post.read_time || "5 min read"}</span>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="group/link inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    <span>Read</span>
                    <span aria-hidden="true" className="transition-transform group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
