import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  // Estados de Navegabilidade
  const [telaAtual, setTelaAtual] = useState('login');
  
  // Estados do Formulário
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  // Estados dos Sensores Agrotech 
  const [umidadeSolo, setUmidadeSolo] = useState(45);
  const [probabilidadePraga, setProbabilidadePraga] = useState(12);

  // NOVO: Estado da Bomba de Irrigação
  const [statusBomba, setStatusBomba] = useState('Desligada');

  // Efeito para simular os dados em tempo real
  useEffect(() => {
    let intervalo;
    if (telaAtual === 'dashboard') {
      intervalo = setInterval(() => {
        // Se a bomba estiver ligada, a umidade não cai, ela sobe para 95%
        if (statusBomba === 'Desligada') {
          setUmidadeSolo((prev) => Math.max(10, Math.min(100, prev + (Math.random() * 10 - 5))));
          setProbabilidadePraga((prev) => Math.max(0, Math.min(100, prev + (Math.random() * 4 - 2))));
        }
      }, 3000);
    }
    return () => clearInterval(intervalo);
  }, [telaAtual, statusBomba]);

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

  // NOVA FUNÇÃO: Interatividade de Comando
  const ativarIrrigacao = () => {
    setStatusBomba('Ligada (Irrigando...)');
    setUmidadeSolo(95); // Joga a umidade para o nível ideal instantaneamente
    setProbabilidadePraga(0); // Zera o risco de pragas
    
    // Desliga a bomba automaticamente após 4 segundos para dar realismo ao sistema
    setTimeout(() => {
      setStatusBomba('Desligada');
    }, 4000);
  };

  // Renderização da Tela de Login
  if (telaAtual === 'login') {
    return (
      <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>Agrotech - Acesso ao Sistema</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '250px' }}
          />
          {erro && <p style={{ color: 'red', margin: '0' }}>{erro}</p>}
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Entrar</button>
        </form>
      </div>
    );
  }

  // Renderização do Dashboard Agrotech
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <h2>Agrotech - Monitoramento Dinâmico</h2>
        <button onClick={() => setTelaAtual('login')} style={{ padding: '5px 15px' }}>Sair</button>
      </header>

      {/* NOVO: Painel de Controle de Ação */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #b0d4ff' }}>
        <h3>Painel de Ações</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={ativarIrrigacao} 
            disabled={statusBomba !== 'Desligada'}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: statusBomba !== 'Desligada' ? '#ccc' : '#007BFF', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: statusBomba !== 'Desligada' ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Ativar Irrigação Manual
          </button>
          <span style={{ fontWeight: 'bold', color: statusBomba === 'Desligada' ? 'gray' : '#007BFF' }}>
            Status da Bomba: {statusBomba}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        
        {/* Card 1: Umidade do Solo */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '250px', textAlign: 'center' }}>
          <h3>Umidade do Solo</h3>
          <h1 style={{ color: umidadeSolo < 30 ? 'red' : 'green' }}>
            {umidadeSolo.toFixed(1)}%
          </h1>
          <p>{umidadeSolo < 30 ? 'Alerta: Irrigação necessária!' : 'Nível adequado.'}</p>
        </div>

        {/* Card 2: Probabilidade de Pragas */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '250px', textAlign: 'center' }}>
          <h3>Risco de Pragas</h3>
          <h1 style={{ color: probabilidadePraga > 20 ? 'orange' : 'green' }}>
            {probabilidadePraga.toFixed(1)}%
          </h1>
          <p>{probabilidadePraga > 20 ? 'Atenção: Risco elevado.' : 'Plantio seguro.'}</p>
        </div>

      </div>
    </div>
  );
}

export default App;