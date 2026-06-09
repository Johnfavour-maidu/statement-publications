import TopicPageClient from "./topic-page-client";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TopicPageClient slug={slug} />;
}
