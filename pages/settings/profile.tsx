import { ReactNode, useState } from "react";

import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { User, createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import LoadingDots from "~/components/ui/LoadingDots";
import { postData } from "~/utils/helpers";
import { useUser } from "~/utils/useUser";

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="p m-auto	my-8 w-full max-w-3xl rounded-md border border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-700">{description}</p>
        {children}
      </div>
      <div className="rounded-b-md border-t border-zinc-700 bg-zinc-200 p-4 text-zinc-700">{footer}</div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link"
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <>
      <Header />

      <section className=" mb-32">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <h1 className="text-4xl font-extrabold  sm:text-center sm:text-6xl">Profile</h1>
          </div>
        </div>
        <div className="p-4">
          <Card
            title="Your Plan"
            description={subscription ? `You are currently on the ${subscription?.prices?.products?.name} plan.` : ""}
            footer={
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
                <button className=" btn" disabled={loading || !subscription} onClick={redirectToCustomerPortal}>
                  Open customer portal
                </button>
              </div>
            }
          >
            <div className="mt-8 mb-4 text-xl font-semibold">
              {isLoading ? (
                <div className="mb-6 h-12">
                  <LoadingDots />
                </div>
              ) : subscription ? (
                `${subscriptionPrice}/${subscription?.prices?.interval}`
              ) : (
                <Link href="/settings/pricing">Choose your plan</Link>
              )}
            </div>
          </Card>
          <Card
            title="Your Name"
            description="Please enter your full name, or a display name you are comfortable with."
            footer={<p>Please use 64 characters at maximum.</p>}
          >
            <div className="mt-8 mb-4 text-xl font-semibold">
              {userDetails ? (
                `${userDetails.full_name ?? `${userDetails.first_name} ${userDetails.last_name}`}`
              ) : (
                <div className="mb-6 h-8">
                  <LoadingDots />
                </div>
              )}
            </div>
          </Card>
          <Card
            title="Your Email"
            description="Please enter the email address you want to use to login."
            footer={<p>We will email you to verify the change.</p>}
          >
            <p className="mt-8 mb-4 text-xl font-semibold">{user ? user.email : undefined}</p>
          </Card>
        </div>
      </section>
    </>
  );
}
