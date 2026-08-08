import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
}

export function SEOHead({ title, description, image }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | Smoke & Fire`
    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        if (name.startsWith('og:')) el.setAttribute('property', name)
        else el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    if (image) setMeta('og:image', image)
  }, [title, description, image])

  return null
}
