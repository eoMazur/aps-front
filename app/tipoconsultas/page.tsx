'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '../components/Header'
import { useRouter } from 'next/navigation'
import api from '../utils/axionconfig'
import BotaoVoltar from '../components/BotaoVoltar'

type TipoConsulta = {
  id: number
  nome: string
  valor: number
}

export default function TiposConsultaPage() {
  const [tipos, setTipos] = useState<TipoConsulta[]>([])
  const [erro, setErro] = useState('')
  const router = useRouter()

  const token = Cookies.get('token')

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])


  const carregarTiposConsulta = async () => {
    setErro('')

    try {
      const resposta = await api.get<TipoConsulta[]>(
        'http://localhost:8080/tipoconsultas',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(resposta.data)
      setTipos(resposta.data)
    } catch (err: any) {
      console.error(err)
    }
  }

  useEffect(() => {
    carregarTiposConsulta()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">
      <Header />

      <BotaoVoltar />
      
      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Tipos de Consulta
          </h2>

          {erro && (
            <p className="text-red-500 text-center font-medium mb-4">{erro}</p>
          )}

          <div className="space-y-4">
            {tipos.length > 0 ? (
              tipos.map((tipo) => (
                <div
                  key={tipo.id}
                  className="flex justify-between items-center bg-blue-50 p-4 rounded-md shadow"
                >
                  <div>
                    <p><span className="font-semibold">Nome:</span> {tipo.nome}</p>
                    <p><span className="font-semibold">Valor:</span> R$ {tipo.valor.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhum tipo de consulta encontrado.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
