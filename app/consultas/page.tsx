'use client'

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Cookies from 'js-cookie'
import axios from "axios"
import api from "../utils/axionconfig"
import { useRouter } from 'next/navigation'
import BotaoVoltar from "../components/BotaoVoltar"

type Consulta = {
  id: number
  idTipoConsulta: number
  pacienteId: number
  descricao: string
  data: Date
}

type ConsultaComInfo = {
  id: number
  nomeTipoConsulta: string
  nomePaciente: string
  descricao: string
  data: string
}

export default function ListarConsultas() {
  const [consultas, setConsultas] = useState<ConsultaComInfo[]>([])
  const [erro, setErro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [tamanhoPagina, setTamanhoPagina] = useState(5)
  const [totalConsultas, setTotalConsultas] = useState(0)

  const token = Cookies.get('token')

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  const carregarConsultas = async () => {
    setErro('')

    try {
      const offset = paginaAtual * tamanhoPagina
      const resposta = await api.get<Consulta[]>(
        'http://localhost:8080/consultas',
        {
          params: { limit: tamanhoPagina, offset },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const consultasBrutas = resposta.data

      const consultasComInfo: ConsultaComInfo[] = await Promise.all(
        consultasBrutas.map(async (consulta) => {
          const [tipoResp, pacienteResp] = await Promise.all([
            axios.get(`http://localhost:8080/tipoconsultas/${consulta.idTipoConsulta}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:8080/usuarios/${consulta.pacienteId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ])

          return {
            id: consulta.id,
            nomeTipoConsulta: tipoResp.data.nome,
            nomePaciente: pacienteResp.data.nome,
            descricao: consulta.descricao,
            data: new Date(consulta.data).toLocaleDateString('pt-BR'),
          }
        })
      )

      setConsultas(consultasComInfo)
      setTotalConsultas(consultasComInfo.length)
    } catch (err) {
      console.error(err)
      setErro('Erro ao buscar consultas.')
    }
  }

  useEffect(() => {
    carregarConsultas()
  }, [paginaAtual, tamanhoPagina])

  const totalPaginas = Math.ceil(totalConsultas / tamanhoPagina)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header />

      <BotaoVoltar />

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Lista de Consultas</h2>

          {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}

          <div className="space-y-4">
            {consultas.length > 0 ? (
              consultas.map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-4 rounded-lg shadow text-black"
                >
                  <div>
                    <p><span className="font-semibold">Paciente:</span> {consulta.nomePaciente}</p>
                    <p><span className="font-semibold">Tipo:</span> {consulta.nomeTipoConsulta}</p>
                    <p><span className="font-semibold">Data:</span> {consulta.data}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <p><span className="font-semibold">Descrição:</span> {consulta.descricao}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhuma consulta encontrada.</p>
            )}
          </div>

          {/* Paginação */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Consultas por página:</label>
              <select
                value={tamanhoPagina}
                onChange={(e) => {
                  setTamanhoPagina(Number(e.target.value))
                  setPaginaAtual(0)
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 20].map((qtd) => (
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

              <span className="text-sm">Página {paginaAtual + 1} de {totalPaginas || 1}</span>

              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas - 1))}
                disabled={paginaAtual + 1 >= totalPaginas}
                className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
