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
  const [metaUmidade, setMetaUmidade] = useState(30); // O nível crítico que aciona a automação
  const [statusBomba, setStatusBomba] = useState('Desligada');

  // O "Cérebro" do Sistema IoT - Roda a cada 2 segundos
  useEffect(() => {
    if (telaAtual !== 'dashboard') return;

    const intervalo = setInterval(() => {
      setUmidadeSolo((umidadeAtual) => {
        let novaUmidade = umidadeAtual;

        if (statusBomba !== 'Desligada') {
          // Lógica de Absorção: A água entra no solo com uma probabilidade variável (ganho de 5% a 15%)
          const ganhoAbsorcao = Math.floor(Math.random() * 11) + 5;
          novaUmidade = Math.min(100, umidadeAtual + ganhoAbsorcao);
          
          // Automação: Desliga a bomba se atingiu um nível seguro (Meta + 20%)
          if (novaUmidade >= Math.min(100, metaUmidade + 20)) {
            setStatusBomba('Desligada');
          }
        } else {
          // Lógica de Secagem: O sol bate e a umidade cai gradativamente
          novaUmidade = Math.max(0, umidadeAtual - (Math.random() * 3 + 1));
          
          // Gatilho Inteligente (Smart Farm): Liga automaticamente se cair abaixo da meta
          if (novaUmidade < metaUmidade) {
            setStatusBomba('Irrigando (Automático)');
          }
        }
        return novaUmidade;
      });

      // Lógica de Pragas conectada à Umidade
      setProbabilidadePraga((pragaAtual) => {
         if (statusBomba !== 'Desligada') {
             // Água reduz o risco de pragas
             return Math.max(0, pragaAtual - (Math.random() * 5));
         } else {
             // Solo secando aumenta a probabilidade de pragas lentamente
             return Math.max(0, Math.min(100, pragaAtual + (Math.random() * 4 - 1.5)));
         }
      });

    }, 2000); // 2 segundos deixa a movimentação dos dados perfeita para o vídeo

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

  // Renderização da Tela de Login
  if (telaAtual === 'login') {
    return (
      <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        <h2 style={{ color: '#2c3e50' }}>Agrotech - Acesso ao Sistema</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <input 
            type="email" 
            placeholder="Digite seu e-mail corporativo" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', width: '280px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {erro && <p style={{ color: '#e74c3c', margin: '0', fontWeight: 'bold' }}>{erro}</p>}
          <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Acessar Painel
          </button>
        </form>
      </div>
    );
  }

  // Renderização do Dashboard Agrotech
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#ecf0f1', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #bdc3c7', paddingBottom: '15px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Agrotech - Automação Inteligente</h2>
        <button onClick={() => setTelaAtual('login')} style={{ padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sair do Sistema
        </button>
      </header>

      {/* Painel de Controle e Automação */}
      <div style={{ marginTop: '25px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>Painel de Comando Central</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Configuração da Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Gatilho Automático (Umidade Mínima %):</label>
            <input 
              type="number" 
              value={metaUmidade}
              onChange={(e) => setMetaUmidade(Number(e.target.value))}
              style={{ padding: '8px', width: '100px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Botão de Override Manual */}
          <button 
            onClick={acionarBombaManual} 
            disabled={statusBomba !== 'Desligada'}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: statusBomba !== 'Desligada' ? '#95a5a6' : '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: statusBomba !== 'Desligada' ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              height: 'fit-content',
              alignSelf: 'flex-end'
            }}
          >
            Forçar Irrigação Manual
          </button>

          {/* Indicador de Status Visual */}
          <div style={{ alignSelf: 'flex-end', padding: '10px 15px', backgroundColor: statusBomba === 'Desligada' ? '#ecf0f1' : '#d4efdf', borderRadius: '5px', border: `1px solid ${statusBomba === 'Desligada' ? '#bdc3c7' : '#27ae60'}` }}>
            <span style={{ fontWeight: 'bold', color: statusBomba === 'Desligada' ? '#7f8c8d' : '#27ae60' }}>
              Status da Bomba: {statusBomba}
            </span>
          </div>
        </div>
      </div>

      {/* Cards dos Sensores */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        
        {/* Card 1: Umidade do Solo */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '280px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: `5px solid ${umidadeSolo < metaUmidade + 5 ? '#e74c3c' : '#27ae60'}` }}>
          <h3 style={{ color: '#34495e', marginTop: 0 }}>Leitura do Solo</h3>
          <h1 style={{ color: umidadeSolo < metaUmidade + 5 ? '#e74c3c' : '#27ae60', fontSize: '48px', margin: '15px 0' }}>
            {umidadeSolo.toFixed(1)}%
          </h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>{umidadeSolo < metaUmidade + 5 ? 'Nível crítico atingido.' : 'Umidade estabilizada.'}</p>
        </div>

        {/* Card 2: Probabilidade de Pragas */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '280px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: `5px solid ${probabilidadePraga > 20 ? '#f39c12' : '#27ae60'}` }}>
          <h3 style={{ color: '#34495e', marginTop: 0 }}>Risco de Pragas</h3>
          <h1 style={{ color: probabilidadePraga > 20 ? '#f39c12' : '#27ae60', fontSize: '48px', margin: '15px 0' }}>
            {probabilidadePraga.toFixed(1)}%
          </h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>{probabilidadePraga > 20 ? 'Risco elevado devido ao clima.' : 'Ambiente protegido.'}</p>
        </div>

      </div>
    </div>
  );
}

export default App;