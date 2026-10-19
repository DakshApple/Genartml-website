import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ShareButtons } from "@/components/ShareButtons";
import blogsData from "@/content/blogs.json";

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

export async function generateStaticParams() {
  const posts = blogsData as BlogPost[];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = blogsData as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}/`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = blogsData as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const dateStr = new Date(post.created_at).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const cover = post.cover_image?.startsWith("/")
    ? post.cover_image
    : post.cover_image
    ? `/${post.cover_image}`
    : "/assets/blog-cover-1.jpg";

  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    author: {
      "@type": "Organization",
      "name": "Team Genartml",
      "url": "https://genartml.com",
    },
    publisher: {
      "@type": "Organization",
      "name": "Genartml",
      "logo": {
        "@type": "ImageObject",
        "url": "https://genartml.com/assets/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://genartml.com/blog/${slug}/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="tone-white">
        {/* Post Header */}
        <Section tone="white" className="pt-20 pb-12 md:pt-24 md:pb-16">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-6">
            <Link href="/blog/" className="text-small font-medium text-ink-70 underline hover:text-ink">
              ← Back to all posts
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-small text-ink-70">
              <span className="font-medium uppercase">{post.category || "Engineering"}</span>
              <span>·</span>
              <span>{dateStr}</span>
              <span>·</span>
              <span>Author: Team Genartml</span>
              <span>·</span>
              <span>{post.read_time || "5 min read"}</span>
            </div>

            <h1 className="text-display font-light tracking-tight text-ink">
              {post.title}
            </h1>

            <p className="text-body text-ink-70 font-medium border-l-2 border-ink pl-4">
              {post.excerpt}
            </p>

            <div className="w-full pt-4 border-t border-ink/10">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </Section>

        {/* Featured Cover Image */}
        <div className="container-grid max-w-4xl pb-12">
          <div className="relative aspect-video w-full border border-ink overflow-hidden">
            <Image
              src={cover}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Post Content */}
        <Section tone="white" className="pt-0 pb-20">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-neutral max-w-none text-body text-ink space-y-6 [&_h2]:text-h2 [&_h2]:font-medium [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-h3 [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-ink [&_blockquote]:pl-4 [&_blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-16 pt-8 border-t border-ink/10">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </Section>

        {/* Related Posts */}
        {related.length > 0 && (
          <Section tone="white" className="border-t border-ink/10">
            <div className="flex flex-col gap-8">
              <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Related Articles</span>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}/`}
                    className="flex flex-col justify-between border border-ink p-6 hover:bg-ink hover:text-paper"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-small font-medium text-ink-70">{rel.category}</span>
                      <h3 className="text-body font-medium">{rel.title}</h3>
                    </div>
                    <span className="mt-4 text-small font-medium underline">Read →</span>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}
      </article>

      <ClosingCTA tone="black" />
    </>
  );
}
