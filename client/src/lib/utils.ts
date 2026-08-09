// Utility function for merging Tailwind CSS classes cleanly (shadcn helper)
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
