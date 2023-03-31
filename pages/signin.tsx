import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { Logo } from "~/components/lp/Logo";
import LoadingDots from "~/components/ui/LoadingDots";
import { getURL } from "~/utils/helpers";

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <Link href="/">
              <Logo className="h-10" />
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Auth
              supabaseClient={supabaseClient}
              providers={["google"]}
              redirectTo={`${getURL()}home`}
              magicLink={true}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#404040",
                      brandAccent: "#52525b"
                    }
                  }
                }
              }}
              theme="light"
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
