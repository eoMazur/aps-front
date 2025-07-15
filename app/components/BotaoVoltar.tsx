export default function BotaoVoltar(){
    return(
    <div className="max-w-4xl mx-auto px-6 mt-6">
        <button
            onClick={() => window.location.href = '/home'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-gray-700 transition"
        >
            ← Voltar para Home
        </button>
    </div>
    )
}