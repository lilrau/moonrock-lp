interface SectionSnapProps {
  children: React.ReactNode;
  className?: string;
}

/** Semantic wrapper for page sections (snap scroll was removed — it conflicted with Lenis smooth scroll). */
export function SectionSnap({ children, className }: SectionSnapProps) {
  return <div className={className}>{children}</div>;
}
