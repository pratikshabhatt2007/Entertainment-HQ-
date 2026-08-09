// Utility function for merging Tailwind CSS classes cleanly (shadcn helper)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
