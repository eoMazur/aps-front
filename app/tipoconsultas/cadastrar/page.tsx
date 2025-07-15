'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '@/app/components/Header'
import BotaoVoltar from '@/app/components/BotaoVoltar'
import { useRouter } from 'next/navigation'
import api from '../../utils/axionconfig'

export default function CadastrarTipoConsulta() {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const token = Cookies.get('token')

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!nome || !valor) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      await api.post(
        'http://localhost:8080/tipoconsultas',
        {
          nome,
          valor: parseFloat(valor.replace(',', '.')),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMensagem('Tipo de consulta cadastrado com sucesso!')
      setNome('')
      setValor('')
    } catch (err: any) {
      console.error(err)
      setErro('Erro ao cadastrar tipo de consulta.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
        <Header />

        <BotaoVoltar/>

        <main className="max-w-xl mx-auto py-10 px-6">
            <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Cadastrar Tipo de Consulta
            </h2>

            {erro && <p className="text-red-500 mb-4 text-center">{erro}</p>}
            {mensagem && <p className="text-green-600 mb-4 text-center">{mensagem}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    placeholder="Ex: Consulta geral"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    placeholder="Ex: 150.00"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                Cadastrar
                </button>
            </form>
            </div>
        </main>
    </div>
  )
}
