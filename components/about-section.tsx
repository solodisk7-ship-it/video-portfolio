const services = [
  'Video Editing',
  'Motion Design & Titles',
  'Vertical & Social Cutdowns',
]

const tools = ['Adobe Premiere Pro', 'Adobe After Effects', 'AI-assisted tools']

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 md:px-10"
    >
      <div className="border-t border-border pt-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          About
        </h2>
      </div>

      <div className="mt-8 md:mt-12 md:grid md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <p className="max-w-md text-xl leading-relaxed tracking-tight text-pretty md:text-2xl">
            I create motion design and edit short-form video for brands,
            products and social platforms.
          </p>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            My workflow combines AI tools with After Effects and Premiere Pro,
            from the first edit through motion graphics and final delivery.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-0">
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service} className="text-base leading-relaxed">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Tools
            </h3>
            <ul className="flex flex-col gap-2">
              {tools.map((tool) => (
                <li key={tool} className="text-base leading-relaxed">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
