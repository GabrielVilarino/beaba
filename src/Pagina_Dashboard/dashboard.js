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
        const response = await axios.get(`http://127.0.0.1:8000/uploads`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados dos Arquivos:', error);
      }
    };
    
    obterDadosDoDashboard();
  }, []);
  
  function formatarData(dataString, fusoHorario = "UTC"){
    const dataUTC = new Date(dataString + "Z"); // Adiciona "Z" para indicar que está em UTC
    const opcoes = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: fusoHorario,
    };
    
    // Formatação da data para o formato desejado
    return dataUTC.toLocaleDateString("pt-BR", opcoes);
  }

  return (
    <div className='dashboard'>
        <Header />
      <div className='dashboard__container'>
        <Menu />
        <div className='dashboard_content'>
            <h1>DashBoard</h1>
            <div className='tabela_container'>
              {dashboardData ?(
              <table className='tabela'>
                  <tbody>
                    <tr className='tabela_cabecalho'>
                        <th>Nome do Arquivo</th>
                        <th>Usuário</th>
                        <th>Data de Upload</th>
                        <th>Formato</th>
                        <th>Ação</th>
                    </tr>
                    {dashboardData.map((dashboard) => (
                        <tr key={dashboard.id}>
                            <th>{dashboard.nome}</th>
                            <th>{dashboard.nomeUsuario}</th>
                            <th>{formatarData(dashboard.dataUpload, "America/Sao_Paulo")}</th>
                            <th>{dashboard.extensao}</th>
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

/*
<tr>
                        <th>Arquivo 1</th>
                        <th>5</th>
                        <th>150</th>
                        <th>XLSX</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
*/

export default Dashboard;