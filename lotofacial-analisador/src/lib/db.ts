import type { Lote, Concurso } from '../lib/types';

const CONCURSOS_KEY = 'lotofacial_concursos';
const LOTES_KEY = 'lotofacial_lotes';

export const db = {
  concursos: {
    getAll: (): Concurso[] => {
      const data = localStorage.getItem(CONCURSOS_KEY);
      return data ? JSON.parse(data) : [];
    },
    save: (concurso: Concurso): Concurso => {
      const concursos = db.concursos.getAll();
      const existingIndex = concursos.findIndex(c => c.numero === concurso.numero);
      
      if (existingIndex >= 0) {
        concursos[existingIndex] = { ...concursos[existingIndex], ...concurso, updated_at: new Date().toISOString() };
      } else {
        concursos.push({ ...concurso, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      }
      
      localStorage.setItem(CONCURSOS_KEY, JSON.stringify(concursos));
      return concurso;
    },
    getByNumero: (numero: number): Concurso | null => {
      const concursos = db.concursos.getAll();
      return concursos.find(c => c.numero === numero) || null;
    },
    getLatest: (): Concurso | null => {
      const concursos = db.concursos.getAll();
      if (concursos.length === 0) return null;
      return concursos.reduce((latest, current) => 
        current.numero > latest.numero ? current : latest
      );
    },
    delete: (numero: number): void => {
      const concursos = db.concursos.getAll().filter(c => c.numero !== numero);
      localStorage.setItem(CONCURSOS_KEY, JSON.stringify(concursos));
    }
  },
  
  lotes: {
    getAll: (): Lote[] => {
      const data = localStorage.getItem(LOTES_KEY);
      return data ? JSON.parse(data) : [];
    },
    save: (lote: Lote): Lote => {
      const lotes = db.lotes.getAll();
      const newLote = { ...lote, id: Date.now(), created_at: new Date().toISOString() };
      lotes.push(newLote);
      localStorage.setItem(LOTES_KEY, JSON.stringify(lotes));
      return newLote;
    },
    update: (lote: Lote): Lote => {
      const lotes = db.lotes.getAll();
      const index = lotes.findIndex(l => l.id === lote.id);
      if (index >= 0) {
        lotes[index] = { ...lote, updated_at: new Date().toISOString() };
        localStorage.setItem(LOTES_KEY, JSON.stringify(lotes));
        return lotes[index];
      }
      return lote;
    },
    getById: (id: number): Lote | null => {
      const lotes = db.lotes.getAll();
      return lotes.find(l => l.id === id) || null;
    },
    getPendentes: (): Lote[] => {
      const lotes = db.lotes.getAll();
      return lotes.filter(l => l.status === 'pendente');
    },
    getPendentesByConcurso: (concursoNumero: number): Lote[] => {
      const lotes = db.lotes.getAll();
      return lotes.filter(l => l.status === 'pendente' && l.concurso_alvo === concursoNumero);
    },
    delete: (id: number): void => {
      const lotes = db.lotes.getAll().filter(l => l.id !== id);
      localStorage.setItem(LOTES_KEY, JSON.stringify(lotes));
    },
    deleteMultiple: (ids: number[]): void => {
      const lotes = db.lotes.getAll().filter(l => !ids.includes(l.id!));
      localStorage.setItem(LOTES_KEY, JSON.stringify(lotes));
    },
    deleteAll: (): void => {
      localStorage.removeItem(LOTES_KEY);
    }
  }
};
