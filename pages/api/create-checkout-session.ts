import { NextApiHandler } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { getURL } from "~/utils/helpers";
import { stripe } from "~/utils/stripe";
import { createOrRetrieveCustomer } from "~/utils/supabase-admin";

const CreateCheckoutSession: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || ""
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer,
        line_items: [
          {
            price: price.id,
            quantity
          }
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: `${getURL()}settings/profile`,
        cancel_url: `${getURL()}`
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default CreateCheckoutSession;
