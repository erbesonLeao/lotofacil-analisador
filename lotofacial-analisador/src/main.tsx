import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { DadosPage } from './pages/DadosPage'
import { CiclosPage } from './pages/CiclosPage'
import { ExclusaoPage } from './pages/ExclusaoPage'
import { GeracaoPage } from './pages/GeracaoPage'
import { ConferenciaPage } from './pages/ConferenciaPage'
import { HistoricoPage } from './pages/HistoricoPage'
import { RegrasPage } from './pages/RegrasPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dados" element={<DadosPage />} />
              <Route path="/ciclos" element={<CiclosPage />} />
              <Route path="/exclusao" element={<ExclusaoPage />} />
              <Route path="/geracao" element={<GeracaoPage />} />
              <Route path="/conferencia" element={<ConferenciaPage />} />
              <Route path="/historico" element={<HistoricoPage />} />
              <Route path="/regras" element={<RegrasPage />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
