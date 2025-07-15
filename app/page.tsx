'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Clínica Privada</h1>
        <p className="text-gray-600 mb-8">
          Bem-vindo(a) ao sistema da Clínica Privada. Aqui você pode acessar seus dados, agendar consultas
          e acompanhar seu histórico médico com facilidade e segurança.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Entrar
          </button>

          <button
            onClick={() => router.push('/auth/register')}
            className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-all"
          >
            Registrar
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-8">© 2025 Clínica Privada. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
