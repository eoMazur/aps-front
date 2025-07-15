'use client'

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie'
import BotaoVoltar from "../../components/BotaoVoltar";
import api from "../../utils/axionconfig";

type CadastroUsuario = {
  nome: string
  senha: string
  email: string
  telefone: string
  cidade: string
  cargo: number
}

export default function cadastrarUsuario(){

    const router = useRouter()
    const [erro, setErro] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/auth/login')
        }
    } , [router])

    const [cadastro, setCadastro] = useState<CadastroUsuario>({
        nome: '',
        senha: '',
        email: '',
        telefone: '',
        cidade: '',
        cargo: 0
    })

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCadastro({ ...cadastro, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      await api.post('http://localhost:8080/auth/register', cadastro)
      router.push('/')
    } catch (erro) {
      console.error('Erro:', erro)
      setErro('Erro ao registrar. Verifique os dados e tente novamente.')
    }
  }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-black">

        <Header />

        <div className="max-w-2xl mx-auto mt-6">
            <BotaoVoltar />
        </div>

            <main className="max-w-2xl mx-auto py-10 px-6">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                        Cadastro - Clínica Privada
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome completo"
                        value={cadastro.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={cadastro.senha}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={cadastro.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={cadastro.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="text"
                        name="cidade"
                        placeholder="Cidade"
                        value={cadastro.cidade}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <select
                        name="cargo"
                        value={cadastro.cargo}
                        onChange={(e) => setCadastro({ ...cadastro, cargo: Number(e.target.value) })}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full text-black"
                    >
                        <option value={1}>Paciente</option>
                        <option value={2}>Recepcionista</option>
                        <option value={3}>Admin</option>
                    </select>

                    {erro && (
                        <div className="text-red-500 text-sm text-center">{erro}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Cadastrar
                    </button>
                    </form>
                </div>
        </main>
        </div>
  )
}