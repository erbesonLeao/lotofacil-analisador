import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Volante } from '../components/Volante';
import { cn } from '../lib/utils';
import { Save, Trash2, FileText } from 'lucide-react';
import type { Concurso } from '../lib/types';

export function DadosPage() {
  const { concursos, saveConcurso } = useApp();
  const [numero, setNumero] = useState('');
  const [data, setData] = useState('');
  const [dezenasSelecionadas, setDezenasSelecionadas] = useState<number[]>([]);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const handleToggleDezena = (dezena: number) => {
    if (dezenasSelecionadas.includes(dezena)) {
      setDezenasSelecionadas(dezenasSelecionadas.filter(d => d !== dezena));
    } else if (dezenasSelecionadas.length < 15) {
      setDezenasSelecionadas([...dezenasSelecionadas, dezena]);
    }
  };

  const handleSalvarConcurso = () => {
    if (!numero || !data || dezenasSelecionadas.length !== 15) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos e selecione 15 dezenas' });
      return;
    }

    const concurso: Concurso = {
      numero: parseInt(numero),
      data,
      dezenas: dezenasSelecionadas.sort((a, b) => a - b),
    };

    try {
      saveConcurso(concurso);
      setMensagem({ tipo: 'sucesso', texto: `Concurso ${numero} salvo com sucesso!` });
      setNumero('');
      setData('');
      setDezenasSelecionadas([]);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar concurso' });
    }

    setTimeout(() => setMensagem(null), 3000);
  };

  const handleLimpar = () => {
    setDezenasSelecionadas([]);
    setNumero('');
    setData('');
  };

  const sortedConcursos = [...concursos].sort((a, b) => b.numero - a.numero);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Dados e Histórico de Concursos</h1>
        <p className="text-secondary">Importar CSV, atualizar concursos, inserir resultados oficiais</p>
      </div>

      {/* Formulário de inserção */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">Inserir Resultado Oficial</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-secondary mb-2">Número do Concurso</label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
              placeholder="Ex: 3000"
            />
          </div>
          
          <div>
            <label className="block text-sm text-secondary mb-2">Data do Sorteio</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-secondary mb-2">
            Selecione as 15 dezenas ({dezenasSelecionadas.length}/15)
          </label>
          <Volante
            selecionadas={dezenasSelecionadas}
            onClick={handleToggleDezena}
          />
        </div>

        {mensagem && (
          <div className={cn(
            'mb-4 p-3 rounded-lg text-sm',
            mensagem.tipo === 'sucesso' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          )}>
            {mensagem.texto}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSalvarConcurso}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            Salvar Concurso
          </button>
          
          <button
            onClick={handleLimpar}
            className="flex items-center gap-2 bg-border hover:bg-border/80 text-text px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Limpar
          </button>
        </div>
      </div>

      {/* Lista de concursos */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Concursos Carregados</h2>
          <span className="text-sm text-secondary">{concursos.length} registros</span>
        </div>

        {concursos.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-secondary">Nenhum concurso carregado</p>
            <p className="text-sm text-secondary mt-1">Insira o primeiro resultado oficial acima</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Concurso</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Dezenas</th>
                </tr>
              </thead>
              <tbody>
                {sortedConcursos.map((concurso) => (
                  <tr key={concurso.numero} className="border-b border-border/50 hover:bg-background/50">
                    <td className="py-3 px-4 text-text font-medium">{concurso.numero}</td>
                    <td className="py-3 px-4 text-secondary">
                      {new Date(concurso.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {concurso.dezenas.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center justify-center w-7 h-7 rounded bg-primary/10 text-primary text-xs font-semibold"
                          >
                            {d.toString().padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
