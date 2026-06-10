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
  const [metaUmidade, setMetaUmidade] = useState(30); 
  const [statusBomba, setStatusBomba] = useState('Desligada');

  // O "Cérebro" do Sistema IoT - Roda a cada 2 segundos
  useEffect(() => {
    if (telaAtual !== 'dashboard') return;

    const intervalo = setInterval(() => {
      setUmidadeSolo((umidadeAtual) => {
        let novaUmidade = umidadeAtual;

        if (statusBomba !== 'Desligada') {
          // Lógica de Absorção: A água entra no solo com uma probabilidade variável
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

  // Renderização da Tela de Login
  if (telaAtual === 'login') {
    return (
      <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        <h2 style={{ color: '#2c3e50' }}>Agrotech - Acesso ao Sistema</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <input 
            type="email"