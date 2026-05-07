'use client'

import Link from 'next/link'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around p-3 md:hidden">
      <Link href="/chat">Chat</Link>
      <Link href="/dev">Dev</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}