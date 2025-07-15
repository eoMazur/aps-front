'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Header from '../../components/Header'
import BotaoVoltar from '../../components/BotaoVoltar'
import api from '../../utils/axionconfig'

type Usuario = {
  id: number
  nome: string
  email: string
  telefone: string
  cidade: string
  cargo: number
}

const traduzirCargo = (cargo: number) => {
  switch (cargo) {
    case 1:
      return 'Paciente'
    case 2:
      return 'Recepcionista'
    case 3:
      return 'Admin'
    default:
      return 'Desconhecido'
  }
}

export default function UsuarioDetalhes() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) {
          setErro('Você precisa estar logado para visualizar este usuário.')
          return
        }

        const resposta = await api.get<Usuario>(`http://localhost:8080/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUsuario(resposta.data)
      } catch (err) {
        console.error(err)
        setErro('Erro ao buscar dados do usuário.')
      }
    }

    if (id) {
      carregarUsuario()
    }
  }, [id])

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 font-semibold">
        {erro}
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header/>

      <BotaoVoltar />

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Detalhes do Usuário</h2>

        <div className="space-y-4 text-lg">
          <p><span className="font-semibold">ID:</span> {usuario.id}</p>
          <p><span className="font-semibold">Nome:</span> {usuario.nome}</p>
          <p><span className="font-semibold">Email:</span> {usuario.email}</p>
          <p><span className="font-semibold">Telefone:</span> {usuario.telefone}</p>
          <p><span className="font-semibold">Cidade:</span> {usuario.cidade}</p>
          <p><span className="font-semibold">Cargo:</span> {traduzirCargo(usuario.cargo)}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </div>
      </main>
    </div>
  )
}
