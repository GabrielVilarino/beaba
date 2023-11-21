import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from'./assets/logout.png';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const obterDadosDoDashboard = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/uploads');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados dos Arquivos:', error);
      }
    };
    obterDadosDoDashboard();
  }, []);

  function formatarData(dataString, fusoHorario = 'UTC') {
    const dataUTC = new Date(dataString + 'Z');
    const opcoes = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: fusoHorario,
    };

    // Formatação da data para o formato desejado
    return dataUTC.toLocaleDateString('pt-BR', opcoes);
  }

  function formatarNomeUsuario(nomeCompleto) {
    let partes = nomeCompleto.split(' ');
    let nome = partes.slice(0, 2).join(' ');
    return nome;
  }

  return (
    <div className='dashboard'>
      <Header />
      <div className='dashboard__container'>
        <Menu />
        <div className='dashboard_content'>
          <h1>DashBoard</h1>
          <div className='tabela_container_dashboard'>
            {dashboardData ?(
              <table className='tabela_dashboard'>
                <tbody>
                  <tr className='tabela_cabecalho_dashboard'>
                    <th>Nome do Arquivo</th>
                    <th>Usuário</th>
                    <th>Squad</th>
                    <th>Data de Upload</th>
                    <th>Template</th>
                    <th>Ação</th>
                  </tr>
                  {dashboardData.map((dashboard) => (
                    <tr key={dashboard.id}>
                      <th>{dashboard.nome}</th>
                      <th>{formatarNomeUsuario(dashboard.nomeUsuario)}</th>
                      <th>{dashboard.nomeSquad}</th>
                      <th>{formatarData(dashboard.dataUpload, 'America/Sao_Paulo')}</th>
                      <th>{dashboard.status}</th>
                      <th>
                        <a href={dashboard.path} download>
                          <button>Download</button>
                        </a>
                      </th>
                    </tr>
                  ))}

                </tbody>
              </table>
            ) : (
              <p>Carregando dados dos templates</p>
            )}
          </div>
          <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;