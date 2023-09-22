import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import remarkGfm from "remark-gfm"

import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"
import { getURL } from "~/utils/helpers"

export default function SettingsAvatarAPIPage({ token }: { token: string }) {
  const router = useRouter()
  const { username } = router.query as { username: string }

  const [copied, setCopied] = useState(false)

  const api = `${getURL()}api/webhooks/memoCreate/${token ?? "<token>"}`

  return (
    <>
      <MainLayout>
        <AvatarProfileHeader username={username} isSetting />

        <div className="mx-auto mt-4 max-h-full w-full overflow-y-auto rounded-lg bg-white px-2 sm:max-w-screen-sm">
          <>
            {token ? (
              <>
                <div className="form-control">
                  <label htmlFor="token" className="label">
                    API
                  </label>
                  <input
                    value={token ? api : ""}
                    placeholder=""
                    id="token"
                    readOnly
                    className="input-bordered input  w-full  hover:outline-none focus:outline-none"
                  />

                  {copied ? <label className="label text-primary">Copied</label> : null}
                  <CopyToClipboard text={api} onCopy={() => setCopied(true)}>
                    <button disabled={!token} className="btn my-4">
                      Copy API
                    </button>
                  </CopyToClipboard>
                </div>

                <div className=" ">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900 ">How to use</h2>

                  <div className=" rounded-lg bg-base-100 p-4">
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
            ) : (
              <div className="min-h-16 m-8 flex h-full items-center justify-center">
                <div>
                  <p className="text-center text-gray-700 ">API is only for Pro Plan</p>
                  <h2 className="text-center text-lg font-bold tracking-tight text-gray-700 ">
                    <Link href={`/settings/profile`} className="link-hover link-primary link">
                      Subscribe to Pro Plan
                    </Link>
                  </h2>
                </div>
              </div>
            )}
          </>
        </div>
      </MainLayout>
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
  const avatar_username = username?.toLocaleLowerCase()

  const { data: token, error } = await supabase.from("tokens").select().eq("avatar_id", avatar_username).single()

  if (error) {
    console.error(error)
    return {
      props: {
        token: ""
      }
    }
  }

  return {
    props: {
      token: token?.masked_token ?? ""
    }
  }
}
