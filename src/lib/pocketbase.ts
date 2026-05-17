import PocketBase from "pocketbase";

function resolvePocketBaseUrl() {
  const raw = (
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090"
  ).trim();
  const isLocal = raw.includes("localhost") || raw.includes("127.0.0.1");

  if (!isLocal && raw.startsWith("http://")) {
    return raw.replace("http://", "https://");
  }

  return raw;
}

export const pb = new PocketBase(resolvePocketBaseUrl());
pb.autoCancellation(false);

export const pbAuth = pb.authStore;

export default pb;
