import { useForm } from "react-hook-form";

import Head from "next/head";
import { useRouter } from "next/router";

import { Header } from "~/components/lp/Header";

export default function NewAvatarPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      name: "",
      source: ""
    }
  });

  const onSubmit = async (data: { username: string; name: string; source: string }) => {
    // TODO: @tanstack/query
    const createAvatarMutation = await fetch("/api/avatars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!createAvatarMutation.ok) {
      throw new Error(createAvatarMutation.statusText);
    }

    router.push("/settings/avatars");
  };

  return (
    <>
      <Head>
        <title>Request your Avatar</title>
      </Head>
      <Header />
      <div className="flex flex-col pb-60">
        <div className="flex-1 ">
          <div className="mx-auto flex w-full sm:max-w-screen-sm flex-col items-center px-3 pt-4 sm:pt-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Request your Avatar</h2>
              {/* <p className="mt-4 text-lg leading-8 text-gray-600">
            Talking with the AIer anytime, without worrying about their availability.
          </p> */}
            </div>

            <form className="relative w-full mt-4 form-control" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className=" label">
                  Avatar Username
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="aier"
                  {...register("username", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="name" className=" label">
                  Avatar Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Aier"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="source" className=" label">
                  Avatar Source
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="https://twitter.com/aier"
                  {...register("source", { required: true })}
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
