import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Database,
  TrendingUp,
  Filter,
  Sparkles,
  CheckCircle,
  History,
  BookOpen,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Database, label: 'Dados e histórico', path: '/dados' },
  { icon: TrendingUp, label: 'Ciclos e movimentação', path: '/ciclos' },
  { icon: Filter, label: 'Exclusão (Cérebro 2)', path: '/exclusao' },
  { icon: Sparkles, label: 'Geração (Cérebro 3)', path: '/geracao' },
  { icon: CheckCircle, label: 'Conferência', path: '/conferencia' },
  { icon: History, label: 'Histórico de lotes', path: '/historico' },
  { icon: BookOpen, label: 'Regras e filtros', path: '/regras' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary">Lotofácil<span className="text-text">Analisador</span></h1>
        <p className="text-xs text-secondary mt-1">Software Profissional</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-secondary hover:text-text hover:bg-border/50'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-xs text-secondary text-center">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
