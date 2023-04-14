import { PropsWithChildren } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { getURL } from "~/utils/helpers";

import { PageMeta } from "../../types";

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function LandingLayout({ children, meta: pageMeta }: Props) {
  const router = useRouter();
  const meta = {
    title: "AIer: Seed. Train. Interact. For personalized and intelligent AI digital avatars",
    description:
      "AIer is a service for creating, training, and interacting with AI digital avatars. Get help and companionship from AI digital avatars anytime, anywhere.",
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta property="og:url" content={`https://aier.app${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {/* <meta property="og:image" content={meta.cardImage} /> */}
        <meta property="og:image" content={`${getURL()}api/og`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aierdotapp" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${getURL()}api/og`} />
      </Head>
      <main id="skip">{children}</main>
    </>
  );
}
