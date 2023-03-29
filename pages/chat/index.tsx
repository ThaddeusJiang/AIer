import Link from "next/link";

import { Header } from "~/components/lp/Header";
import { Hero } from "~/components/lp/Hero";

export default function ChatPage() {
  return (
    <>
      <Header />
      <Hero />
      <div className="flex flex-col">
        <div className="flex-1 ">
          <div className="mx-auto flex w-full sm:max-w-screen-sm flex-col items-center pt-4 sm:pt-8">
            <h1 className="mt-6 text-center text-lg sm:text-2xl">
              talk with{" "}
              <Link href={`/settings/avatars`} className="link">
                your avatars
              </Link>{" "}
              or{" "}
              <Link href={`/avatars`} className="link">
                other avatars
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
