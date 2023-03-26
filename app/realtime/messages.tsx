"use client";

import { useEffect, useState } from "react";

import { Message } from "~/types";
import { supabase } from "~/utils/supabase-client";

export function Messages({ serverPosts }: { serverPosts: Message[] }) {
  const [posts, setPosts] = useState(serverPosts);

  useEffect(() => {
    setPosts(serverPosts);
  }, [serverPosts]);

  useEffect(() => {
    const channel = supabase
      .channel("any")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "queries" }, (payload) => {
        console.debug("t4e");
        setPosts((posts) => [...posts, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setPosts, posts]);

  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
