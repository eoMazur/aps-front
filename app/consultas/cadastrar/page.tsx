'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '@/app/components/Header'
import BotaoVoltar from '@/app/components/BotaoVoltar'
import api from '../../utils/axionconfig'
import { useRouter } from 'next/navigation'

type Paciente = {
  id: number
  nome: string
  cargo: number
  email: string
  telefone: string
  cidade: string
}

type TipoConsulta = {
  id: number
  nome: string
  valor: number
}

export default function CadastrarConsulta() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([])

  const [pacienteId, setPacienteId] = useState('')
  const [idTipoConsulta, setIdTipoConsulta] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
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


  useEffect(() => {
    const carregarDados = async () => {

      try {
        const [pacienteResp, tipoResp] = await Promise.all([
          api.get< Paciente[] >('http://localhost:8080/usuarios', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<TipoConsulta[]>('http://localhost:8080/tipoconsultas', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        console.log(pacienteResp.data)


        const pacientesFiltrados = pacienteResp.data.filter(
            (usuario) => usuario.cargo === 1
        )

        setPacientes(pacientesFiltrados)
        setTiposConsulta(tipoResp.data)
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar pacientes ou tipos de consulta.')
      }
    }

    carregarDados()
  }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro('')
        setMensagem('')

        if (!pacienteId || !idTipoConsulta || !data) {
            setErro('Preencha todos os campos obrigatórios.')
            return
        }

        // ✅ Corrige a data antes de enviar ao back-end
        let dataFormatada = data
        if (dataFormatada.length === 16) {
            // Ex: "2025-08-05T23:33" → "2025-08-05T23:33:00"
            dataFormatada += ':00Z'
        }

        try {
            await axios.post(
            'http://localhost:8080/consultas',
            {
                pacienteId: parseInt(pacienteId),
                idTipoConsulta: parseInt(idTipoConsulta),
                descricao,
                data: dataFormatada, // 👈 Aqui está o valor corrigido
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            )

            setMensagem('Consulta cadastrada com sucesso!')
            setPacienteId('')
            setIdTipoConsulta('')
            setDescricao('')
            setData('')
        } 
        catch (err) {
            console.error(err)
            setErro('Erro ao cadastrar consulta.')
        }
    }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-12 mt-6">
        <BotaoVoltar />
      </div>

      <main className="max-w-xl mx-auto py-10 px-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Cadastrar Consulta
          </h2>

          {erro && <p className="text-red-500 mb-4 text-center">{erro}</p>}
          {mensagem && <p className="text-green-600 mb-4 text-center">{mensagem}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paciente *</label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              >
                <option value="">Selecione um paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Consulta *</label>
              <select
                value={idTipoConsulta}
                onChange={(e) => setIdTipoConsulta(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              >
                <option value="">Selecione um tipo</option>
                {tiposConsulta.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Data *</label>
              <input
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Cadastrar Consulta
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
