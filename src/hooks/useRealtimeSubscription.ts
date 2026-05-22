"use client";

import { useEffect, useRef, useState } from "react";
import { pb } from "@/lib/pocketbase";

type RealtimeAction = "create" | "update" | "delete";

interface RealtimeEvent<T = Record<string, unknown>> {
  action: RealtimeAction;
  record: T;
}

export function useRealtimeSubscription<T = Record<string, unknown>>(
  collection: string,
  options?: {
    onAuthRequired?: () => Promise<void>;
    onError?: (err: unknown) => void;
  },
) {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent<T> | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const authAttempted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const startSubscription = async () => {
      if (!pb.authStore.isValid && options?.onAuthRequired) {
        if (authAttempted.current) return;
        authAttempted.current = true;
        try {
          await options.onAuthRequired();
        } catch {
          return;
        }
      }

      if (!pb.authStore.isValid) return;

      try {
        await pb.collection(collection).subscribe("*", (e: { action: string; record: unknown }) => {
          if (cancelled) return;
          setIsConnected(true);
          const event = { action: e.action as RealtimeAction, record: e.record as T };
          setLastEvent(event);
          if (e.action === "create") {
            setUnreadCount((prev) => prev + 1);
          }
        });
      } catch (err) {
        if (!cancelled) options?.onError?.(err);
      }
    };

    startSubscription();

    return () => {
      cancelled = true;
      try {
        pb.collection(collection).unsubscribe();
      } catch {}
    };
  }, [collection]);

  const resetUnread = () => setUnreadCount(0);

  return { lastEvent, unreadCount, resetUnread, isConnected };
}
