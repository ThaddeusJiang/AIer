import Image from "next/image";

import { Tab } from "@headlessui/react";
import { IconDatabase, IconMessage, IconTransform } from "@tabler/icons-react";

import clsx from "clsx";

import { Container } from "~/components/lp/Container";
import LogoOpenAI from "~/images/logos/openai.jpeg";
import screenshotChat from "~/images/screenshots/chat.png";
import screenshotMemo from "~/images/screenshots/memo.png";

const features = [
  {
    name: "Collect",
    summary: "Rapidly import and automatically integrate data",
    description:
      "Quickly import data through various methods such as bulk import, daily writing, and API integration, allowing your AI avatar to have access to more information and knowledge.",
    image: screenshotMemo,
    icon: <IconDatabase size={80} stroke={1} color="#fff" />
  },
  {
    name: "Train",
    summary: "Specifically trained with personalized",
    description:
      "Our AI Avatars are not just any generic bots - they are specifically trained with your data to create a personalized and authentic experience. ",
    image: LogoOpenAI,
    icon: <IconTransform size={80} stroke={1} color="#fff" />
  },
  {
    name: "Interact",
    summary: "Human-like Interactions",
    description:
      "Our AI avatars interact with you like a real person, with emotions, style, and humor. Get ready for personalized, human-like interactions that will make you forget you're talking to a machine.",
    image: screenshotChat,
    icon: <IconMessage size={80} stroke={1} color="#fff" />
  }
];

function Feature({ feature, isActive, className, ...props }) {
  return (
    <div className={clsx(className, !isActive && "opacity-75 hover:opacity-100")} {...props}>
      <div className={clsx("h-20 w-20 rounded-lg", isActive ? "bg-blue-600" : "bg-slate-500")}>{feature.icon}</div>
      <h3 className={clsx("mt-6 text-3xl font-medium", isActive ? "text-blue-600" : "text-slate-600")}>
        {feature.name}
      </h3>
      <p className="mt-2 font-display text-lg text-slate-900">{feature.summary}</p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}

function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.name}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <Image src={feature.image} alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.name}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="[&:not(:focus-visible)]:focus:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  )
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>
          <Tab.Panels className="relative mt-20 overflow-hidden rounded-4xl bg-slate-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={feature.name}
                  className={clsx(
                    "px-5 transition duration-500 ease-in-out [&:not(:focus-visible)]:focus:outline-none",
                    featureIndex !== selectedIndex && "opacity-60"
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <Image className="w-full" src={feature.image} alt="" width={400} height={700} />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Train AI Avatars with your data
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Collect, Train, Interact. For the most personalized AI digital avatars.
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
