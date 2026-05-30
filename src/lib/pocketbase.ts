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

interface PocketBaseFileRecord {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  [key: string]: unknown;
}

function isAlreadyResolvableImageSrc(value: string) {
  return /^(https?:|data:|blob:|\/)/i.test(value);
}

export function resolvePocketBaseFileUrl(
  record: object,
  filenameOrUrl?: unknown,
) {
  if (typeof filenameOrUrl !== "string") return "";

  const value = filenameOrUrl.trim();
  if (!value) return "";
  if (isAlreadyResolvableImageSrc(value)) return value;

  return pb.files.getURL(record as PocketBaseFileRecord, value);
}

export default pb;
