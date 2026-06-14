import { notFound } from "next/navigation";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { ChannelPage } from "@/components/channels/ChannelPage";
import { TvFrame } from "@/components/layout/TvFrame";
import { channelSlugs, getChannel, type ChannelSlug } from "@/lib/content/channels";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return channelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const channel = getChannel(slug);

  if (!channel) {
    return {
      title: "Channel not found - YantraCore",
    };
  }

  return {
    title: `${channel.name} TV Channel - YantraCore`,
    description: channel.tagline,
  };
}

export default async function ProjectChannelRoute({ params }: PageProps) {
  const { slug } = await params;
  const channel = getChannel(slug);

  if (!channel) notFound();

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <ChannelPage slug={channel.slug as ChannelSlug} />
      </TvFrame>
    </>
  );
}
