import { GetStaticPropsResult } from "next"

import { Avatar, Product } from "types"

import Pricing from "~/components/Pricing"
import Landing from "~/components/lp/Landing"
import { getActiveProductsWithPrices, getPublicAvatars } from "~/utils/supabase-client"

interface Props {
  products: Product[]
  avatars: Avatar[]
}

// export default function PricingPage({ products }: Props) {
//   return <Pricing products={products} />;
// }

export default function LandingPage({ products, avatars }: Props) {
  // return <Pricing products={products} />;
  return <Landing avatars={avatars} />
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices()
  const avatars = await getPublicAvatars()

  return {
    props: {
      products,
      avatars
    },
    revalidate: 60
  }
}
