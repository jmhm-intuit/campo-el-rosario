import type { PropsWithChildren, ReactNode } from 'react'

export function Panel({
  title,
  action,
  className = '',
  children,
}: PropsWithChildren<{ title?: string; action?: ReactNode; className?: string }>) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel__header">
          {title && <h2>{title}</h2>}
          {action && <div className="panel__action">{action}</div>}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: PropsWithChildren<{ tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }>) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description: string }) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
