import "styles/chrome-bug.css";
import "styles/main.css";

import { useEffect, useState } from "react";
import React from "react";

import { AppProps } from "next/app";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import type { Database } from "types_db";

import Layout from "~/components/Layout";
import { MyUserContextProvider } from "~/utils/useUser";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <div>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
