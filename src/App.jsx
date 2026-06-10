import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [umidadeSolo, setUmidadeSolo] = useState(45);
  const [probabilidadePraga, setProbabilidadePraga] = useState(12);
  const [metaUmidade, setMetaUmidade] = useState(30); 
  const [statusBomba, setStatusBomba] = useState('Desligada');
  const [logs, setLogs] = useState([]);
  const [horaReal, setHoraReal] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraReal(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (telaAtual === 'dashboard') {
      const horaLog = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      setLogs((prev) => [`[${horaLog}] Status da Bomba alterado para: ${statusBomba}`, ...prev].slice(0, 5));
    }
  }, [statusBomba, telaAtual]);

  useEffect(() => {
    if (telaAtual !== 'dashboard') return;
    const intervalo = setInterval(() => {
      setUmidadeSolo((umidadeAtual) => {
        let novaUmidade = umidadeAtual;
        if (statusBomba !== 'Desligada') {
          const ganhoAbsorcao = Math.floor(Math.random() * 11) + 5;
          novaUmidade = Math.min(100, umidadeAtual + ganhoAbsorcao);
          if (novaUmidade >= Math.min(100, metaUmidade + 20)) {
            setStatusBomba('Desligada');
          }
        } else {
          novaUmidade = Math.max(0, umidadeAtual - (Math.random() * 3 + 1));
          if (novaUmidade < metaUmidade) {
            setStatusBomba('Irrigando (Automático)');
          }
        }
        return novaUmidade;
      });
      setProbabilidadePraga((pragaAtual) => {
         if (statusBomba !== 'Desligada') return Math.max(0, pragaAtual - (Math.random() * 5));
         else return Math.max(0, Math.min(100, pragaAtual + (Math.random() * 4 - 1.5)));
      });
    }, 2000); 
    return () => clearInterval(intervalo);
  }, [telaAtual, statusBomba, metaUmidade]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }
    setErro('');
    setTelaAtual('dashboard');
  };

  const acionarBombaManual = () => {
    if (statusBomba === 'Desligada') {
      setStatusBomba('Irrigando (Manual)');
    }
  };

  if (telaAtual === 'login') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eef2f5', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#fff', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Agrotech Plataforma</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="email" placeholder="E-mail corporativo" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #dcdde1' }} />
            {erro && <span style={{ color: '#e74c3c' }}>{erro}</span>}
            <button type="submit" style={{ padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '50px' }}>
      <header style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Painel Agrotech</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px' }}>{horaReal}</span>
            </div>
            {/* NOVO BOTÃO DE PITCH */}
            <a href="SEU_LINK_DO_YOUTUBE_AQUI" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 15px', backgroundColor: '#f39c12', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
              Veja o vídeo pitch
            </a>
            <button onClick={() => setTelaAtual('login')} style={{ padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3>Automação & Controle</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label>Gatilho (%):</label>
            <input type="number" value={metaUmidade} onChange={(e) => setMetaUmidade(Number(e.target.value))} style={{ padding: '8px' }} />
            <button onClick={acionarBombaManual} disabled={statusBomba !== 'Desligada'} style={{ padding: '8px 15px' }}>Irrigação Manual</button>
            <span>Status: {statusBomba}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Leitura do Solo</h3>
            <h1 style={{ color: umidadeSolo < metaUmidade + 5 ? '#e74c3c' : '#27ae60' }}>{umidadeSolo.toFixed(1)}%</h1>
            <p>{umidadeSolo < metaUmidade + 5 ? 'Atenção: Nível Crítico' : 'Umidade Estável.'}</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Risco de Pragas</h3>
            <h1 style={{ color: probabilidadePraga > 20 ? '#f39c12' : '#27ae60' }}>{probabilidadePraga.toFixed(1)}%</h1>
            <p>{probabilidadePraga > 20 ? 'Alerta: Risco Elevado' : 'Risco Controlado'}</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Histórico</h3>
            {logs.map((log, index) => <div key={index} style={{ fontSize: '12px', padding: '5px' }}>{log}</div>)}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;