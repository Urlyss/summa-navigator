import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL for Convex HTTP client");
}

let client: ConvexHttpClient | null = null;

export function getConvexServerClient() {
  if (!client) {
    client = new ConvexHttpClient(convexUrl);
  }
  return client;
}

