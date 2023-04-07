import { useForm } from "react-hook-form";

import Head from "next/head";
import { useRouter } from "next/router";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import classNames from "classnames";
import * as yup from "yup";

import { Header } from "~/components/lp/Header";

const schema = yup
  .object({
    username: yup
      .string()
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "username must start with a letter and only contain alphanumeric characters and underscores"
      )
      .required(),
    name: yup.string().required(),
    source: yup.string().required(),
    bio: yup.string(),
    avatar_url: yup.string()
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function NewAvatarPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      name: "",
      source: "",
      bio: "",
      avatar_url: ""
    },
    resolver: yupResolver(schema)
  });

  const avatarCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return fetch("/api/avatarCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      const { id, error } = data;
      if (error) {
        console.error(error);
        setError(
          "username",
          { type: "custom", message: "the username is already taken. please choose another one." },
          {
            shouldFocus: true
          }
        );
      } else {
        router.push(`/settings/avatars/${id}`);
      }
    }
  });

  const onSubmit = async (data: FormData) => {
    avatarCreateMutation.mutate(data);
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
              <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Create an Avatar
              </h2>
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
                {errors.username ? <span className="text-red-500">{errors.username.message}</span> : null}
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
                {errors.name ? <span className="text-red-500">{errors.name.message}</span> : null}
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
                {errors.source ? <span className="text-red-500">{errors.source.message}</span> : null}
              </div>

              <div>
                <label htmlFor="avatar_url" className=" label">
                  Avatar URL
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="https://example.com/avatar.png"
                  {...register("avatar_url")}
                />
              </div>

              <div>
                <label htmlFor="bio" className=" label">
                  Bio
                </label>
                <textarea className="textarea textarea-bordered w-full" placeholder="Add a bio" {...register("bio")} />
              </div>

              <div className="py-4">
                <button
                  type="submit"
                  disabled={avatarCreateMutation.isLoading}
                  className={classNames(" btn btn-primary w-full", {
                    " loading": avatarCreateMutation.isLoading
                  })}
                >
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
