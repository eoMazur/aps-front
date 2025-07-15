'use client'

import { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

type loginDto = {
  email: string
  senha: string
}

export default function Login() {
  const [loginDto, setLoginDto] = useState<loginDto>({ email: '', senha: '' })
  const [mensagemErro, setMensagemErro] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDto({ ...loginDto, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagemErro('')

    try {
      const resposta = await axios.post('http://localhost:8080/auth/login', loginDto)
      const token = resposta.data.token
      Cookies.set('token', token, { expires: 1, path: '/' })

      router.push('/home')
    } catch (erro) {
      console.error('Erro:', erro)
      setMensagemErro('E-mail ou senha inválidos. Por favor, verifique e tente novamente.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Clínica Privada
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={loginDto.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="exemplo@clinica.com"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              name="senha"
              value={loginDto.senha}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {mensagemErro && (
            <div className="text-red-500 text-sm text-center">{mensagemErro}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Não possui conta?{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Registrar-se
          </a>
        </p>


        <p className="text-sm text-gray-500 mt-4 text-center">
          © 2025 Clínica Privada. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
