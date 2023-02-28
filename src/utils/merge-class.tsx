import { JSXInternal } from "preact/src/jsx";

export function mergeClass(
  ...classList: (
    | string
    | JSXInternal.SignalLike<string | undefined>
    | undefined
  )[]
) {
  return classList.filter(Boolean).join(" ");
}
