/**
 * Generates a URL-friendly slug from a display name and user ID.
 * Example: "Junior Raymond" with id 5 → "junior-raymond-5"
 */
export function generateUserSlug(displayName: string, userId: number): string {
  const base = displayName
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base}-${userId}`;
}