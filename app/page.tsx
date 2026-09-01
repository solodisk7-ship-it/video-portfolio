import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { Intro } from '@/components/intro'
import { SiteHeader } from '@/components/site-header'
import { WorksSection } from '@/components/works-section'

export default function Page() {
  return (
    <div id="site-shell" className="min-h-svh bg-background font-sans">
      <SiteHeader />

      <main>
        <Intro />
        <div className="flex flex-col gap-20 md:gap-28">
          <WorksSection />
          <AboutSection />
          <ContactSection />
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pt-20 pb-8 md:px-10 md:pt-28">
        <div className="flex flex-col gap-2 border-t border-border pt-6 md:flex-row md:items-baseline md:justify-end">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            &copy; 2026 &mdash; All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
