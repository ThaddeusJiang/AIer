import { GetStaticPropsResult } from "next";

import { Product } from "types";

import Pricing from "~/components/Pricing";
import Landing from "~/components/lp/Landing";
import { getActiveProductsWithPrices } from "~/utils/supabase-client";

interface Props {
  products: Product[];
}

// export default function PricingPage({ products }: Props) {
//   return <Pricing products={products} />;
// }

export default function LandingPage({ products }: Props) {
  // return <Pricing products={products} />;
  return <Landing />;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
