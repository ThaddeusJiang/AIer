import "styles/chrome-bug.css";
import "styles/main.css";

import { useEffect, useState } from "react";
import React from "react";
import { Toaster } from "react-hot-toast";

import { AppProps } from "next/app";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { Database } from "types_db";

import Layout from "~/components/lp/LandingLayout";
import { MyUserContextProvider } from "~/utils/useUser";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false // default: true
    }
  }
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <MyUserContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MyUserContextProvider>
        </SessionContextProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      <Toaster />
    </div>
  );
}
