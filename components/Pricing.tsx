import { useRouter } from "next/router";

import clsx from "clsx";
import { Price, ProductWithPrice } from "types";

import { postData } from "~/utils/helpers";
import { getStripe } from "~/utils/stripe-client";
import { useUser } from "~/utils/useUser";

import { Container } from "./lp/Container";
import { SwirlyDoodle } from "./lp/Pricing";

interface Props {
  products: ProductWithPrice[];
}

const billingInterval = "month";

function Plan({
  name,
  price,
  description,
  features,
  featured = false,
  children
}: {
  price: string;
  name?: string;
  description?: string;
  features?: string[];
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={clsx(
        "flex flex-col rounded-3xl px-6 sm:px-8",
        featured ? "order-first bg-blue-600 py-8 lg:order-none" : "lg:py-8"
      )}
    >
      <h3 className="mt-5 font-display text-lg text-white">{name}</h3>
      <p className={clsx("mt-2 text-base", featured ? "text-white" : "text-slate-400")}>{description}</p>
      <p className="order-first font-display text-5xl font-light tracking-tight text-white">
        {price} <span className="text-xl">/ {billingInterval}</span>
      </p>
      {/* <ul
        role="list"
        className={clsx(
          'order-last mt-10 flex flex-col gap-y-3 text-sm',
          featured ? 'text-white' : 'text-slate-200'
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? 'text-white' : 'text-slate-400'} />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul> */}
      {children}
    </section>
  );
}

export default function Pricing({ products }: Props) {
  const router = useRouter();

  const { user, isLoading, subscription } = useUser();

  const handleCheckout = async (price: Price) => {
    if (!user) {
      return router.push("/signin");
    }
    if (subscription) {
      // MEMO: 支付成功后，会自动跳转到 /home 页面
      return router.push("/home");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
    }
  };

  return (
    <section id="pricing" aria-label="Pricing" className="bg-slate-900 py-20 sm:py-32">
      <Container>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            <span className="relative whitespace-nowrap">
              <SwirlyDoodle className="absolute top-1/2 left-0 h-[1em] w-full fill-blue-400" />
              <span className="relative">Simple pricing,</span>
            </span>{" "}
            for everyone.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            You can request a refund at any time if you genuinely feel that the service is not valuable.
          </p>
        </div>
        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-2 xl:mx-0 xl:gap-x-8">
          {products.map((product, index) => {
            const price = product?.prices?.find((price) => price.interval === billingInterval);
            if (!price) return null;
            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);

            const featured = index === 0;

            return (
              <Plan
                featured={featured}
                key={product.id}
                name={product?.name}
                price={priceString}
                description={product?.description}
                // features={product?.metadata.features.split(',')}
                // featured={product?.metadata.featured === 'true'}
              >
                <button
                  className={clsx("btn", featured ? "btn-secondary" : "")}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleCheckout(price)}
                >
                  {product.name === subscription?.prices?.products?.name ? "Manage" : "Subscribe"}
                </button>
              </Plan>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
