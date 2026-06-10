import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Estados de Navegabilidade
  const [telaAtual, setTelaAtual] = useState('login');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  // 2. Estados dos Sensores e Automação
  const [umidadeSolo, setUmidadeSolo] = useState(45);
  const [probabilidadePraga, setProbabilidadePraga] = useState(12);
  const [metaUmidade, setMetaUmidade] = useState(30); 
  const [statusBomba, setStatusBomba] = useState('Desligada');

  // 3. Novos Estados: Logs e Tempo Real
  const [logs, setLogs] = useState([]);
  const [horaReal, setHoraReal] = useState('');

  // Efeito 1: Relógio em tempo real (Horário de Brasília)
  useEffect(() => {
    const timer = setInterval(() => {
      setHoraReal(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Efeito 2: Gerador de Logs (Memória do Sistema)
  useEffect(() => {
    if (telaAtual === 'dashboard') {
      const horaLog = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      setLogs((prev) => [`[${horaLog}] Status da Bomba alterado para: ${statusBomba}`, ...prev].slice(0, 5));
    }
  }, [statusBomba, telaAtual]);

  // Efeito 3: Cérebro do Sistema IoT (Probabilidades e Automação)
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
         if (statusBomba !== 'Desligada') {
             return Math.max(0, pragaAtual - (Math.random() * 5));
         } else {
             return Math.max(0, Math.min(100, pragaAtual + (Math.random() * 4 - 1.5)));
         }
      });
    }, 2000); 

    return () => clearInterval(intervalo);
  }, [telaAtual, statusBomba, metaUmidade]);

  // Função de validação de Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }
    setErro('');
    setTelaAtual('dashboard');
  };

  // Botão de Emergência Manual
  const acionarBombaManual = () => {
    if (statusBomba === 'Desligada') {
      setStatusBomba('Irrigando (Manual)');
    }
  };

  // ================= TELA DE LOGIN =================
  if (telaAtual === 'login') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eef2f5', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <div style={{ backgroundColor: '#fff', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <div style={{ backgroundColor: '#27ae60', color: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px', fontWeight: 'bold' }}>
            AG
          </div>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Agrotech Plataforma</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '30px', fontSize: '14px' }}>Acesse o painel de monitoramento</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              type="email" 
              placeholder="E-mail corporativo" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '15px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '15px', outline: 'none' }}
            />
            {erro && <span style={{ color: '#e74c3c', fontSize: '13px', fontWeight: '600', textAlign: 'left' }}>{erro}</span>}
            <button type="submit" style={{ padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.3s' }}>
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= TELA DO DASHBOARD =================
  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* Header Premium */}
      <header style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#27ae60', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AG</div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Painel Agrotech</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#bdc3c7' }}>Horário Oficial (BRT)</span>
            <strong style={{ fontSize: '18px' }}>{horaReal}</strong>
          </div>
          <button onClick={() => setTelaAtual('login')} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Painel Central de Comando */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px', borderLeft: '6px solid #3498db' }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Automação & Controle</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap', marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d', textTransform: 'uppercase' }}>Gatilho (% Mínima)</label>
              <input 
                type="number" 
                value={metaUmidade}
                onChange={(e) => setMetaUmidade(Number(e.target.value))}
                style={{ padding: '12px', width: '120px', borderRadius: '6px', border: '1