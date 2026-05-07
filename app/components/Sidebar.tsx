'use client'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-black border-r border-gray-800 p-6 flex-col gap-4">
      <h1 className="text-xl font-bold">VoidAI</h1>
      <Link href="/chat">Chat</Link>
      <Link href="/dev">Dev</Link>
      <Link href="/media">Media</Link>
      <Link href="/music">Music</Link>
      <Link href="/android">Android</Link>
      <Link href="/vault">Vault</Link>
      <Link href="/settings">Settings</Link>
    </aside>
  )
}
