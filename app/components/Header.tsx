'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-blue-700 text-white px-6 py-4 shadow-md flex items-center justify-between ">
      <h1
        className="text-xl font-bold cursor-pointer hover:underline"
        onClick={() => router.push('/home')}
      >
        Clínica Privada
      </h1>
    </header>
  )
}
