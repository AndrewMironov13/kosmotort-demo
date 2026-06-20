export default function LiquidGlassLink({ className = '', children, ...props }) {
  return (
    <a className={`liquid-glass ${className}`} {...props}>
      <span className="liquid-glass__surface" aria-hidden="true" />
      <span className="liquid-glass__shine" aria-hidden="true" />
      <span className="liquid-glass__content">{children}</span>
    </a>
  )
}
