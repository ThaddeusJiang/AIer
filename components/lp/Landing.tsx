import Head from 'next/head';

import { CallToAction } from '@/components/lp/CallToAction';
import { Faqs } from '@/components/lp/Faqs';
import { Footer } from '@/components/lp/Footer';
import { Header } from '@/components/lp/Header';
import { Hero } from '@/components/lp/Hero';
import { Pricing } from '@/components/lp/Pricing';
import { PrimaryFeatures } from '@/components/lp/PrimaryFeatures';
import { SecondaryFeatures } from '@/components/lp/SecondaryFeatures';
import { Testimonials } from '@/components/lp/Testimonials';

export default function Home() {
  return (
    <>
      <Head>
        <title>TaxPal - Accounting made simple for small businesses</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>

      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
