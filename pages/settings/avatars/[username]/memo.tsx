import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { AvatarProfileTabs } from "~/components/ui/Avatar/AvatarProfileTabs";
import { Avatar } from "~/types";

export default function MemoCreatePage({ avatar }: { avatar: Avatar }) {
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      content: "",
      avatar_id: avatar.id
    },
    values: {
      content: "",
      avatar_id: avatar.id
    }
  });

  const memoCreateMutation = useMutation({
    mutationFn: async (data: { content: string; avatar_id: string }) => {
      const res = await fetch("/api/memoCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Memo created", {
        position: "bottom-center"
      });
      reset();
    },
    onError: (error) => {
      toast.error("Memo creation failed", {
        position: "bottom-center"
      });
    }
  });

  const onSubmit = (data: { content: string; avatar_id: string }) => {
    memoCreateMutation.mutate(data);
  };

  const content = watch("content");

  return (
    <>
      <Header />
      <section className="px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
        <AvatarProfileHeader avatar={avatar} />
        <AvatarProfileTabs avatar={avatar} />
        <div className="mt-4 px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full form-control">
            <input type="hidden" {...register("avatar_id")} />
            <div id="content" className=" relative">
              <textarea
                className="textarea text-base textarea-bordered focus:outline-none w-full text-gray-900 "
                rows={5}
                {...register("content", {
                  required: true
                })}
              />
            </div>
            <button
              disabled={!content || memoCreateMutation.isLoading}
              className=" mt-4 btn btn-primary "
              type="submit"
            >
              Quick Memo
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }

  const { username } = context.params as { username: string };

  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase());

  const avatar = data?.[0];
  if (avatar?.owner_id !== user.id) {
    return {
      notFound: true
    };
  }

  if (error) {
    console.error(error);
    return {
      props: {
        avatar: null
      }
    };
  }

  if (data.length === 0) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      avatar: data[0]
    }
  };
};
