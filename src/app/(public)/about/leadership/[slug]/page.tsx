import { notFound } from "next/navigation";
import { getLeaderBySlug, leaders } from "@/lib/leadership-data";
import LeadershipProfileClient from "./leadership-profile-client";

export function generateStaticParams() {
  return leaders.map((leader) => ({ slug: leader.slug }));
}

export default function LeadershipProfile({ params }: { params: { slug: string } }) {
  const leader = getLeaderBySlug(params.slug);
  if (!leader) notFound();

  return <LeadershipProfileClient leader={leader} />;
}
