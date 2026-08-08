import type { ReactNode } from 'react'

type Platform = 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'phone' | 'email' | 'website'

const platformColors: Record<Platform, string> = {
  instagram: 'hover:text-pink-500',
  facebook: 'hover:text-blue-500',
  tiktok: 'hover:text-white',
  whatsapp: 'hover:text-green-500',
  phone: 'hover:text-green-500',
  email: 'hover:text-orange',
  website: 'hover:text-orange',
}

interface SocialIconProps {
  platform: Platform
  url: string
  icon: ReactNode
}

export function SocialIcon({ platform, url, icon }: SocialIconProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-12 h-12 text-text-secondary transition-colors border border-border rounded hover:border-text-secondary ${platformColors[platform]}`}
      aria-label={platform}
    >
      {icon}
    </a>
  )
}
