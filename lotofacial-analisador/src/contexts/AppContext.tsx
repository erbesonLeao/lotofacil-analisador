import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Concurso, Lote } from '../lib/types';
import { db } from '../lib/db';

interface AppContextType {
  concursos: Concurso[];
  lotes: Lote[];
  refreshConcursos: () => void;
  refreshLotes: () => void;
  saveConcurso: (concurso: Concurso) => Concurso;
  saveLote: (lote: Lote) => Lote;
  updateLote: (lote: Lote) => Lote;
  deleteLote: (id: number) => void;
  deleteLotes: (ids: number[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const refreshConcursos = () => {
    setConcursos(db.concursos.getAll());
  };

  const refreshLotes = () => {
    setLotes(db.lotes.getAll());
  };

  useEffect(() => {
    refreshConcursos();
    refreshLotes();
  }, []);

  const saveConcurso = (concurso: Concurso): Concurso => {
    const saved = db.concursos.save(concurso);
    refreshConcursos();
    return saved;
  };

  const saveLote = (lote: Lote): Lote => {
    const saved = db.lotes.save(lote);
    refreshLotes();
    return saved;
  };

  const updateLote = (lote: Lote): Lote => {
    const updated = db.lotes.update(lote);
    refreshLotes();
    return updated;
  };

  const deleteLote = (id: number) => {
    db.lotes.delete(id);
    refreshLotes();
  };

  const deleteLotes = (ids: number[]) => {
    db.lotes.deleteMultiple(ids);
    refreshLotes();
  };

  return (
    <AppContext.Provider value={{
      concursos,
      lotes,
      refreshConcursos,
      refreshLotes,
      saveConcurso,
      saveLote,
      updateLote,
      deleteLote,
      deleteLotes,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
