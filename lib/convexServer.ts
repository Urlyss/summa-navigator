import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;


let client: ConvexHttpClient | null = null;

export function getConvexServerClient() {
  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL for Convex HTTP client");
  }
  if (!client) {
    client = new ConvexHttpClient(convexUrl);
  }
  return client;
}

