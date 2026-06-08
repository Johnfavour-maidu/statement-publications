import { notFound } from "next/navigation";
import { getLeaderBySlug, leaders } from "@/lib/leadership-data";
import LeadershipProfileClient from "./leadership-profile-client";

export function generateStaticParams() {
  return leaders.map((leader) => ({ slug: leader.slug }));
}

export default async function LeadershipProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);
  if (!leader) notFound();

  return <LeadershipProfileClient leader={leader} />;
}
