import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

import { GetServerSidePropsContext } from "next"
import Link from "next/link"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import remarkGfm from "remark-gfm"

import { Header } from "~/components/lp/Header"
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { AvatarProfileTabs } from "~/components/ui/Avatar/AvatarProfileTabs"
import { Avatar } from "~/types"
import { getURL } from "~/utils/helpers"

export default function SettingsAvatarAPIPage({ avatar, token }: { avatar: Avatar; token: string }) {
  const [copied, setCopied] = useState(false)

  const api = `${getURL()}api/webhooks/memoCreate/${token ?? "<token>"}`

  return (
    <>
      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
        <AvatarProfileHeader avatar={avatar} />
        <AvatarProfileTabs avatar={avatar} active="api" />
        <div className="mx-auto mt-4 max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
          <div className=" ">
            <>
              <div className="form-control">
                <label htmlFor="token" className="label">
                  API
                </label>
                <input
                  value={token ? api : ""}
                  placeholder="API is only for Pro Plan"
                  id="token"
                  readOnly
                  className="input-bordered input w-full "
                />

                {copied ? <label className="label text-primary">Copied</label> : null}
                <CopyToClipboard text={api} onCopy={() => setCopied(true)}>
                  <button disabled={!token} className="btn my-4">
                    Copy API
                  </button>
                </CopyToClipboard>
              </div>

              {token ? null : (
                <h2 className="text-center text-lg font-bold tracking-tight text-gray-700 ">
                  <Link href={`/settings/profile`} className="link-hover link-primary link">
                    Subscribe to Pro Plan
                  </Link>
                </h2>
              )}

              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900 ">How to use</h2>

                <div className=" bg-base-100 p-4">
                  <p>POST {api}</p>
                  <ReactMarkdown
                    children={`
Content-type: application/json

\`\`\`json
{
  "content": "Hello World"
}
\`\`\`
                `}
                    remarkPlugins={[remarkGfm]}
                  ></ReactMarkdown>
                </div>
              </div>
            </>
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = context.params as { username: string }

  const { data: avatar, error: avatarError } = await supabase
    .from("avatars")
    .select()
    .eq("username", username.toLowerCase())
    .single()

  if (avatarError) {
    console.error(avatarError)
    return {
      props: {
        avatar: null
      }
    }
  }

  if (!avatar) {
    return {
      notFound: true
    }
  }

  const { data: token, error } = await supabase.from("tokens").select().eq("avatar_id", avatar?.id).single()

  return {
    props: {
      avatar,
      token: token?.masked_token ?? null
    }
  }
}
