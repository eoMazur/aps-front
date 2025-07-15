'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Header from '../components/Header'
import { useRouter } from 'next/navigation'
import BotaoVoltar from '../components/BotaoVoltar'
import api from '../utils/axionconfig'

type Usuario = {
  id: number
  nome: string
  cargo: number
  email: string
  telefone: string
  cidade: string
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

export default function DashboardUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [erro, setErro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [tamanhoPagina, setTamanhoPagina] = useState(5)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [buscaNome, setBuscaNome] = useState('')

  const token = Cookies.get('token')

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])


  const carregarUsuarios = async () => {
    setErro('')

    try {
      const offset = paginaAtual * tamanhoPagina
      const resposta = await api.get<{ data: Usuario[]; total: number }>(
        'http://localhost:8080/usuarios',
        {
          params: { limit: tamanhoPagina, offset },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setUsuarios(resposta.data.data || resposta.data)
      setTotalUsuarios(resposta.data.total || 0)
    } catch (err) {
      console.error(err)
      setErro('Erro ao buscar usuários. Verifique sua autenticação.')
    }
  }

  const buscarPorNome = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!token) {
      setErro('Você precisa estar logado.')
      return
    }

    if (buscaNome.trim() === '') {
      setPaginaAtual(0)
      carregarUsuarios()
      return
    }

    try {
      const resposta = await api.get<Usuario[]>(
        `http://localhost:8080/usuarios/nome/${buscaNome}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUsuarios(resposta.data)
      setTotalUsuarios(resposta.data.length)
    } catch (err) {
      console.error(err)
      setErro('Usuário não encontrado.')
      setUsuarios([])
    }
  }

  useEffect(() => {
    if (buscaNome.trim() === '') {
      carregarUsuarios()
    }
  }, [paginaAtual, tamanhoPagina, buscaNome])

  const totalPaginas = Math.ceil(totalUsuarios / tamanhoPagina)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header/>

      <BotaoVoltar />
      
      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Lista de Usuários
        </h2>

        {/* Campo de Busca */}
        <form
          onSubmit={buscarPorNome}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}

        <div className="space-y-4">
         {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
                <div
                key={usuario.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-4 rounded-lg shadow text-black"
                >
                <div>
                    <p><span className="font-semibold">Nome:</span> {usuario.nome}</p>
                    <p><span className="font-semibold">E-mail:</span> {usuario.email}</p>
                    <p><span className="font-semibold">Cargo:</span> {traduzirCargo(usuario.cargo)}</p>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                    <p><span className="font-semibold">Telefone:</span> {usuario.telefone}</p>
                    <p><span className="font-semibold">Cidade:</span> {usuario.cidade}</p>

                    <Link href={`/usuarios/${usuario.id}`} className="mt-2 inline-block">
                    <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        Ver Detalhes
                    </button>
                    </Link>
                </div>
                </div>
            ))
            ) : (
            <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
            )}
        </div>

        {buscaNome.trim() === '' && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Usuários por página:</label>
              <select
                value={tamanhoPagina}
                onChange={(e) => {
                  setTamanhoPagina(Number(e.target.value))
                  setPaginaAtual(0)
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 20, 50].map((qtd) => (
                  <option key={qtd} value={qtd}>
                    {qtd}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 0))}
                disabled={paginaAtual === 0}
                className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm">
                Página {paginaAtual + 1} de {totalPaginas || 1}
              </span>

              <button
                onClick={() =>
                  setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas - 1))
                }
                disabled={paginaAtual + 1 >= totalPaginas}
                className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  )
}
