import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useApp } from '../contexts/AppContext';
import {
  Database,
  TrendingUp,
  Filter,
  Sparkles,
  CheckCircle,
  History,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const cards = [
  {
    icon: Database,
    title: 'Dados e histórico',
    description: 'Importar CSV, atualizar concursos, inserir resultados oficiais',
    path: '/dados',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    icon: TrendingUp,
    title: 'Ciclos e movimentação',
    description: 'Ciclo das 25 dezenas, linhas, colunas, moldura × miolo',
    path: '/ciclos',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    icon: Filter,
    title: 'Exclusão (Cérebro 2)',
    description: 'Mapa pesada/média/leve, definir pool de dezenas',
    path: '/exclusao',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
  {
    icon: Sparkles,
    title: 'Geração (Cérebro 3)',
    description: 'Gerar lotes com filtros, modos Forte/Intermediário/Econômico',
    path: '/geracao',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    icon: CheckCircle,
    title: 'Conferência de resultados',
    description: 'Informar resultado, conferir lotes, analisar exclusões',
    path: '/conferencia',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: History,
    title: 'Histórico de lotes',
    description: 'Listar, selecionar, excluir lotes salvos',
    path: '/historico',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
  },
  {
    icon: BookOpen,
    title: 'Regras e filtros (Cérebro 1)',
    description: 'Consultar padrões de linhas/colunas, pares, soma, sequência',
    path: '/regras',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
  },
];

export function Dashboard() {
  const { concursos, lotes } = useApp();

  const ultimoConcurso = concursos.length > 0 
    ? concursos.reduce((latest, current) => current.numero > latest.numero ? current : latest)
    : null;

  const lotesPendentes = lotes.filter(l => l.status === 'pendente').length;
  const totalLotes = lotes.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-secondary">Ponto de entrada visual com acesso a todos os setores</p>
      </div>

      {/* Resumo do último concurso */}
      {ultimoConcurso && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-text mb-4">Último Concurso</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-secondary text-sm mb-1">Concurso</p>
              <p className="text-2xl font-bold text-primary">{ultimoConcurso.numero}</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-secondary text-sm mb-1">Data</p>
              <p className="text-lg font-medium text-text">{new Date(ultimoConcurso.data).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-secondary text-sm mb-1">Dezenas sorteadas</p>
              <p className="text-lg font-medium text-text">{ultimoConcurso.dezenas.length}</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-secondary text-sm mb-1">Total de concursos</p>
              <p className="text-2xl font-bold text-text">{concursos.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Indicadores rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-secondary text-sm">Lotes pendentes</p>
            <CheckCircle className="w-5 h-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-warning">{lotesPendentes}</p>
          <p className="text-xs text-secondary mt-1">Aguardando conferência</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-secondary text-sm">Total de lotes</p>
            <History className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{totalLotes}</p>
          <p className="text-xs text-secondary mt-1">Salvos no histórico</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-secondary text-sm">Concursos carregados</p>
            <Database className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{concursos.length}</p>
          <p className="text-xs text-secondary mt-1">No banco de dados</p>
        </div>
      </div>

      {/* Cards de acesso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('p-3 rounded-lg', card.bgColor)}>
                <card.icon className={cn('w-6 h-6', card.color)} />
              </div>
              <ArrowRight className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">{card.title}</h3>
            <p className="text-sm text-secondary">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
