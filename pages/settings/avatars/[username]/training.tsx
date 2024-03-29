import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"

import { yupResolver } from "@hookform/resolvers/yup"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { IconCash } from "@tabler/icons-react"
import { useMutation } from "@tanstack/react-query"
import { Card, Flex, Grid, Icon, Metric, ProgressBar, Text } from "@tremor/react"

import axios from "axios"
import * as yup from "yup"

import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { ContentLayout } from "~/components/ui/Layouts/ContentLayout"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"

const schema = yup.object({
  url: yup.string().url()
})

export default function TrainingPage({ essaysCount }: { essaysCount: number }) {
  const router = useRouter()
  const { username } = router.query as { username: string }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      url: "",
      avatar: username
    },
    resolver: yupResolver(schema)
  })

  const externalContentCreateMutation = useMutation({
    mutationFn: async ({ url, avatar }: { url: string; avatar: string }) => {
      const res = await axios.post("/api/externalContentCreateByURL", {
        url,
        avatar
      })
      return res
    },
    onSuccess: () => {
      toast.success("Training started!")
      reset()
    },
    onError: () => {
      toast.error("Failed to start training")
    }
  })

  const embeddingCreateByURL = (data: { url: string; avatar: string }) => {
    externalContentCreateMutation.mutate({
      url: data.url,
      avatar: data.avatar
    })
  }

  const url = watch("url")

  return (
    <>
      <MainLayout>
        <AvatarProfileHeader username={username} isSetting={true} />
        <ContentLayout>
          <h1 className=" mb-4 text-2xl">Training</h1>

          <section className=" grid grid-cols-2 gap-8">
            <Card decoration="top" decorationColor={"indigo"}>
              <Flex justifyContent="start" className="space-x-4">
                <Icon icon={IconCash} variant="light" size="xl" color={"indigo"} />
                <div className="truncate">
                  <Text className=" capitalize">essays</Text>
                  <Metric className="truncate">{essaysCount.toLocaleString("en")}</Metric>
                </div>
              </Flex>
            </Card>
          </section>

          <form onSubmit={handleSubmit(embeddingCreateByURL)} className=" form-control">
            <input type="hidden" {...register("avatar")} />
            <div>
              <label htmlFor="url" className=" label">
                Website
              </label>

              <input
                type="text"
                id="url"
                {...register("url")}
                placeholder="https://your-website/..."
                className=" input-bordered input w-full"
              />
              <label htmlFor="url" className="label-text text-error">
                {errors.url?.message}
              </label>

              <div className="mt-4">
                <button disabled={!url} className="btn-primary btn">
                  tain
                </button>
              </div>
            </div>
          </form>
        </ContentLayout>
      </MainLayout>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = context.params as { username: string }
  const avatar_username = username.toLowerCase()

  // get embedding amount
  const { count: essaysCount, error: _ } = await supabase
    .from("embeddings")
    .select("*", { count: "exact", head: true })
    .eq("avatar_id", avatar_username)

  return {
    props: {
      essaysCount
    }
  }
}
