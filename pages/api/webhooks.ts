import { Readable } from "node:stream"

import { NextApiRequest, NextApiResponse } from "next"

import Stripe from "stripe"

import { stripe } from "~/utils/stripe"
import { manageSubscriptionStatusChange, upsertPriceRecord, upsertProductRecord } from "~/utils/supabase-admin"

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  }
}

// MEMO: https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/nextjs/pages/api/webhooks.ts#L58
const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk)
    })

    req.on("end", () => {
      resolve(Buffer.concat(chunks))
    })

    req.on("error", reject)
  })
}

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req)
    const sig = req.headers["stripe-signature"]
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET
    let event: Stripe.Event

    try {
      if (!sig || !webhookSecret) return
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err: any) {
      console.error(`❌ Error message: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "product.created":
          case "product.updated":
            await upsertProductRecord(event.data.object as Stripe.Product)
            break
          case "price.created":
          case "price.updated":
            await upsertPriceRecord(event.data.object as Stripe.Price)
            break
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription
            await manageSubscriptionStatusChange(
              subscription.id,
              subscription.customer as string,
              event.type === "customer.subscription.created"
            )
            break
          case "checkout.session.completed":
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            if (checkoutSession.mode === "subscription") {
              const subscriptionId = checkoutSession.subscription
              await manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true)
            }
            break
          default:
            throw new Error("Unhandled relevant event!")
        }
      } catch (error) {
        console.error(error)
        return res.status(400).send('Webhook error: "Webhook handler failed. View logs."')
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method Not Allowed")
  }
}

export default webhookHandler
