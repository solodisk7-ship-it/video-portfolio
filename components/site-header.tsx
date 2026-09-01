const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-baseline justify-end px-6 py-3 md:px-10 md:py-5">
        <nav aria-label="Primary">
          <ul className="flex items-baseline gap-6 md:gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
