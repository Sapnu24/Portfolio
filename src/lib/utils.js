// Minimal class-name joiner used by the Vengeance UI components.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
