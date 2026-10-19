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
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
            Engineering & Strategy
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Insights from production.
          </h1>
          <p className="text-body text-ink-70">
            Plain words on building software, deploying AI workflows, and running business operations. No hype.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
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
              <article key={post.slug} className="flex flex-col border border-ink justify-between">
                <div>
                  <div className="relative aspect-video w-full overflow-hidden border-b border-ink">
                    <Image
                      src={cover}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <div className="flex items-center justify-between text-small text-ink-70">
                      <span className="font-medium uppercase">{post.category || "Engineering"}</span>
                      <span>{dateStr}</span>
                    </div>

                    <h2 className="text-h3 font-medium text-ink">
                      <Link href={`/blog/${post.slug}/`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-small text-ink-70 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-ink/10 mt-4 flex items-center justify-between text-small font-medium text-ink">
                  <span>{post.read_time || "5 min read"}</span>
                  <Link href={`/blog/${post.slug}/`} className="underline hover:text-ink-70">
                    Read article →
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
