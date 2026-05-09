'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/dev', label: 'Dev' },
  { href: '/media', label: 'Media' },
  { href: '/vault', label: 'Vault' },
  { href: '/settings', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-void-light border-t border-void-lighter flex justify-around p-3">
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm px-2 py-1 rounded transition ${
              active ? 'text-void-accent font-semibold' : 'text-void-text-muted'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
