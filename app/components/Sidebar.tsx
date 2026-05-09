'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/dev', label: 'Dev' },
  { href: '/media', label: 'Media' },
  { href: '/music', label: 'Music' },
  { href: '/android', label: 'Android' },
  { href: '/vault', label: 'Vault' },
  { href: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      <h1 className="text-xl font-bold mb-4">VoidAI</h1>
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg transition ${
              active
                ? 'bg-void-accent text-white'
                : 'text-void-text hover:bg-void-lighter'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
