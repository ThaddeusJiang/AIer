import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { CallToAction } from "~/components/lp/CallToAction";
import { Faqs } from "~/components/lp/Faqs";
import { Footer } from "~/components/lp/Footer";
import { Header } from "~/components/lp/Header";
import { Hero } from "~/components/lp/Hero";
import { Pricing } from "~/components/lp/Pricing";
import { PrimaryFeatures } from "~/components/lp/PrimaryFeatures";
import { SecondaryFeatures } from "~/components/lp/SecondaryFeatures";
import { Testimonials } from "~/components/lp/Testimonials";
import { Avatar } from "~/types";

import { Avatars } from "./Avatars";

export default function Landing({ avatars }: { avatars: Avatar[] }) {
  return (
    <>
      <Head>
        <title>AIer - AI avatar and digital immortality</title>
        <meta
          name="description"
          content="Break through time and physical limitations, achieve digital avatar and digital immortality. ~ powered by AI"
        />
      </Head>

      <main>
        <Header />
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        {/* <Testimonials /> */}
        <Avatars avatars={avatars} />
        <Pricing />
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  );
}
