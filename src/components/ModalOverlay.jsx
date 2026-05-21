import { createPortal } from "react-dom"

export default function ModalOverlay({ children, onClose, zIndex = 200 }) {
  if (typeof document === "undefined") return null

  return createPortal(
    <div
      className="overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose?.()
      }}
      style={{zIndex}}
    >
      {children}
    </div>,
    document.body
  )
}
