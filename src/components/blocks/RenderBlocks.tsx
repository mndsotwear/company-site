import type { Page } from '@/payload-types'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { ServicesSection } from './ServicesSection'
import { AboutSection } from './AboutSection'
import { StatsSection } from './StatsSection'
import { RoutesSection } from './RoutesSection'
import { FeaturedVesselsSection } from './FeaturedVesselsSection'
import { IndustriesSection } from './IndustriesSection'
import { CTASection } from './CTASection'
import { GallerySection } from './GallerySection'
import { FAQSection } from './FAQSection'

type Block = NonNullable<Page['layout']>[number]

// هر بلوک پنل → کامپوننت ظاهری خودش، به همان ترتیبی که در پنل چیده شده
export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block: Block, i) => {
        const key = block.id || `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} {...block} />
          case 'services':
            return <ServicesSection key={key} {...block} />
          case 'about':
            return <AboutSection key={key} {...block} />
          case 'stats':
            return <StatsSection key={key} {...block} />
          case 'routes':
            return <RoutesSection key={key} {...block} />
          case 'featuredVessels':
            return <FeaturedVesselsSection key={key} {...block} />
          case 'industries':
            return <IndustriesSection key={key} {...block} />
          case 'cta':
            return <CTASection key={key} {...block} />
          case 'gallery':
            return <GallerySection key={key} {...block} />
          case 'faq':
            return <FAQSection key={key} {...block} />
          case 'richText':
            return (
              <section key={key} className="py-16">
                <Container>
                  {/* عرض محدود برای خوانایی متن‌های طولانی */}
                  <div className="max-w-3xl">
                    <RichText data={block.content} className="text-lg" />
                  </div>
                </Container>
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
