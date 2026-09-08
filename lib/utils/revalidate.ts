import { revalidatePath } from "next/cache";

/**
 * Safely revalidates a path, handling cases where it is invoked outside a Next.js request context (e.g. test scripts).
 */
export function safeRevalidatePath(path: string, type?: "layout" | "page") {
  try {
    revalidatePath(path, type);
  } catch {
    // Graceful no-op in test/CLI environments without Next.js request store
  }
}
