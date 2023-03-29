import { useForm } from "react-hook-form";

import Head from "next/head";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";

import { Header } from "~/components/lp/Header";

export default function NewAvatarPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      name: "",
      source: "",
      bio: ""
    }
  });

  const createAvatarMutation = useMutation({
    mutationFn: async (data: { username: string; name: string; bio: string; source: string }) => {
      return fetch("/api/avatarCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      router.push(`/settings/avatars/${data.id}`);
    }
  });

  const onSubmit = async (data: { username: string; name: string; bio: string; source: string }) => {
    createAvatarMutation.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Create an Avatar</title>
      </Head>
      <Header />
      <div className="flex flex-col pb-60">
        <div className="flex-1 ">
          <div className="mx-auto flex w-full sm:max-w-screen-sm flex-col items-center px-3 pt-4 sm:pt-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create an Avatar</h2>
              {/* <p className="mt-4 text-lg leading-8 text-gray-600">
            Talking with the AIer anytime, without worrying about their availability.
          </p> */}
            </div>

            <form className="relative w-full mt-4 form-control" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className=" label">
                  Username
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="username"
                  {...register("username", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="name" className=" label">
                  Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
              </div>

              <div>
                <label htmlFor="bio" className=" label">
                  Bio
                </label>
                <textarea className="textarea textarea-bordered w-full" placeholder="Add a bio" {...register("bio")} />
              </div>

              <div>
                <label htmlFor="source" className=" label">
                  Source
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Write your twitter ID here, e.g. @aierdotapp. I will initialize your avatar with your tweets."
                  {...register("source")}
                />
              </div>

              <div className="py-4">
                <button type="submit" className=" btn btn-primary w-full">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
