import type { ReactNode } from "react"

interface MinimalButtonProps {
  onClick: () => void
  children: ReactNode
}

export function MinimalButton({ onClick, children }: MinimalButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-zinc-500 hover:text-zinc-800 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
    >
      {children}
    </button>
  )
}

