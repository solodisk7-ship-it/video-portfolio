import { siteConfig } from '@/content/site-config'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 md:px-10"
    >
      <div className="border-t border-border pt-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Contact
        </h2>
      </div>

      <div className="mt-8 md:mt-12 md:grid md:grid-cols-2 md:gap-16">
        <p className="max-w-md text-xl leading-relaxed tracking-tight text-pretty md:text-2xl">
          Available for motion design and video editing projects.
        </p>

        <div className="mt-8 flex flex-col items-start gap-3 md:mt-0">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="min-h-11 border-b border-border pt-2 text-base tracking-tight transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:text-lg"
          >
            {siteConfig.contact.email}
          </a>
          {siteConfig.contact.telegram ? (
            <a
              href={siteConfig.contact.telegram.url}
              rel="me noopener noreferrer"
              target="_blank"
              className="min-h-11 border-b border-border pt-2 text-base tracking-tight transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:text-lg"
            >
              Telegram {siteConfig.contact.telegram.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
