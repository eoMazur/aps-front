'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type RegistroDto = {
  nome: string
  senha: string
  email: string
  telefone: string
  cidade: string
}

export default function Registrar() {
  const [registro, setRegistro] = useState<RegistroDto>({
    nome: '',
    senha: '',
    email: '',
    telefone: '',
    cidade: '',
  })

  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistro({ ...registro, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      await axios.post('http://localhost:8080/auth/register', registro)
      router.push('/')
    } catch (erro) {
      console.error('Erro:', erro)
      setErro('Erro ao registrar. Verifique os dados e tente novamente.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Cadastro - Clínica Privada
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={registro.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={registro.senha}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={registro.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={registro.telefone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={registro.cidade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
            required
          />

          {erro && (
            <div className="text-red-500 text-sm text-center">{erro}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Registrar
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Já possui conta?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
