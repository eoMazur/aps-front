'use client'

import Header from '../components/Header'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header />

      <main className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Dashboard</h2>

        <p className="mb-6 text-gray-700">
          Bem-vindo ao sistema da <strong>Clínica Privada</strong>. Aqui você pode gerenciar usuários, registros e mais.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Usuários</h3>
            <p className="text-gray-600 text-sm mb-3">Visualize os usuários cadastrados.</p>
            <button
              onClick={() => router.push('/usuarios')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Acessar
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Consultas</h3>
            <p className="text-gray-600 text-sm mb-3">Visualize as consultas agendadas.</p>
            <button
              onClick={() => router.push('/consultas')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              Acessar
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-green-600">Tipo Consultas</h3>
            <p className="text-gray-600 text-sm mb-3">Visualize os Tipo de Consultas da clínica.</p>
            <button
              onClick={() => router.push('/tipoconsultas')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Acessar
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Cadastrar</h3>
            <p className="text-gray-600 text-sm mb-3">Cadastre um novo usuário no sistema.</p>
            <button
              onClick={() => router.push('/usuarios/cadastrar')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Cadastrar Usuário
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Cadastrar Consultas</h3>
            <p className="text-gray-600 text-sm mb-3">Cadastrar consultas no sistema.</p>
            <button
              onClick={() => router.push('/consultas/cadastrar')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              Cadastrar Consulta
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-green-600">Cadastrar Tipo Consultas</h3>
            <p className="text-gray-600 text-sm mb-3">Cadastrar Tipo de Consultas.</p>
            <button
              onClick={() => router.push('/tipoconsultas/cadastrar')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Cadastrar Tipo Consulta
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
