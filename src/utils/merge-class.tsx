export function mergeClass(...classList: (string | undefined)[]) {
  return classList.filter(Boolean).join(" ");
}
