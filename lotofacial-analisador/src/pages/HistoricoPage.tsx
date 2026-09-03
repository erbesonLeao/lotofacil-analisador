import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { cn } from '../lib/utils';
import { History, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export function HistoricoPage() {
  const { lotes, deleteLotes } = useApp();
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const toggleSelecao = (id: number) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(s => s !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  const handleExcluirSelecionados = () => {
    if (selecionados.length === 0) return;
    deleteLotes(selecionados);
    setSelecionados([]);
    setConfirmarExclusao(false);
  };

  const sortedLotes = [...lotes].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Histórico de Lotes</h1>
        <p className="text-secondary">Listar, selecionar e excluir lotes salvos</p>
      </div>

      {/* Ações em lote */}
      {selecionados.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-text font-medium">{selecionados.length} lote(s) selecionado(s)</span>
          </div>
          <div className="flex gap-3">
            {!confirmarExclusao ? (
              <button
                onClick={() => setConfirmarExclusao(true)}
                className="flex items-center gap-2 bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Excluir Selecionados
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-secondary text-sm">Tem certeza?</span>
                <button
                  onClick={handleExcluirSelecionados}
                  className="flex items-center gap-2 bg-error hover:bg-error/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmarExclusao(false)}
                  className="flex items-center gap-2 bg-border hover:bg-border/80 text-text px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de lotes */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <History className="w-5 h-5" />
            Lotes Salvos
          </h2>
          <span className="text-sm text-secondary">{lotes.length} registros</span>
        </div>

        {lotes.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-secondary">Nenhum lote salvo</p>
            <p className="text-sm text-secondary mt-1">Gere e salve jogos na aba Geração</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selecionados.length === lotes.length && lotes.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelecionados(lotes.map(l => l.id!).filter(Boolean) as number[]);
                        } else {
                          setSelecionados([]);
                        }
                      }}
                      className="rounded border-border bg-card text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">K</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Modo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Jogos</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Excluídas</th>
                </tr>
              </thead>
              <tbody>
                {sortedLotes.map((lote) => (
                  <tr key={lote.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(lote.id!)}
                        onChange={() => toggleSelecao(lote.id!)}
                        className="rounded border-border bg-card text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4 text-secondary">
                      {lote.created_at ? new Date(lote.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-3 px-4 text-text font-medium">{lote.k}</td>
                    <td className="py-3 px-4 text-secondary capitalize">{lote.modo}</td>
                    <td className="py-3 px-4 text-text">{lote.jogos.length}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        lote.status === 'pendente'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      )}>
                        {lote.status === 'pendente' ? (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pendente
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Conferido
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {lote.excluidas.slice(0, 3).map(d => (
                          <span
                            key={d}
                            className="w-6 h-6 rounded bg-error/10 text-error flex items-center justify-center text-xs font-semibold"
                          >
                            {d.toString().padStart(2, '0')}
                          </span>
                        ))}
                        {lote.excluidas.length > 3 && (
                          <span className="text-xs text-secondary">+{lote.excluidas.length - 3}</span>
                        )}
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
