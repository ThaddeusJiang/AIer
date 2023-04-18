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
    source_twitter: yup.string().required(),
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
      source_twitter: "",
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
          <div className="mx-auto flex w-full flex-col items-center px-3 pt-4 sm:max-w-screen-sm sm:pt-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Create an Avatar
              </h2>
            </div>

            <form className="form-control relative mt-4 w-full" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className=" label">
                  Username
                </label>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  placeholder="username"
                  id="username"
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
                  className="input-bordered input w-full"
                  placeholder="Name"
                  id="name"
                  {...register("name", { required: true })}
                />
                {errors.name ? <span className="text-red-500">{errors.name.message}</span> : null}
              </div>

              <div>
                <label htmlFor="source_twitter" className=" label">
                  Source Twitter
                </label>
                <input
                  className="input-bordered input w-full"
                  placeholder="your twitter username, e.g. ThaddeusJiang"
                  id="source_twitter"
                  {...register("source_twitter")}
                />
                {errors.source_twitter ? <span className="text-red-500">{errors.source_twitter.message}</span> : null}
              </div>

              <div>
                <label htmlFor="avatar_url" className=" label">
                  Avatar URL
                </label>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  placeholder="https://example.com/avatar.png"
                  id="avatar_url"
                  {...register("avatar_url")}
                />
              </div>

              <div>
                <label htmlFor="bio" className=" label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="textarea-bordered textarea w-full"
                  placeholder="Add a bio"
                  {...register("bio")}
                />
              </div>

              <div className="py-4">
                <button
                  type="submit"
                  disabled={avatarCreateMutation.isLoading}
                  className={classNames(" btn-primary btn w-full", {
                    " loading": avatarCreateMutation.isLoading
                  })}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
