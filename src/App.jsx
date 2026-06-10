import { useState, useEffect } from 'react';
import './App.css'; // Mantenha a importação do seu CSS, se houver

function App() {
  // Estados de Navegabilidade
  const [telaAtual, setTelaAtual] = useState('login');
  
  // Estados do Formulário
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  // Estados dos Sensores Agrotech (Trabalhando com %)
  const [umidadeSolo, setUmidadeSolo] = useState(45);
  const [probabilidadePraga, setProbabilidadePraga] = useState(12);

  // Efeito para simular os dados em tempo real (atualiza a cada 3 segundos)
  useEffect(() => {
    let intervalo;
    if (telaAtual === 'dashboard') {
      intervalo = setInterval(() => {
        // Gera flutuações nas porcentagens para simular leitura de sensores
        setUmidadeSolo((prev) => Math.max(10, Math.min(100, prev + (Math.random() * 10 - 5))));
        setProbabilidadePraga((prev) => Math.max(0, Math.min(100, prev + (Math.random() * 4 - 2))));
      }, 3000);
    }
    return () => clearInterval(intervalo);
  }, [telaAtual]);

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