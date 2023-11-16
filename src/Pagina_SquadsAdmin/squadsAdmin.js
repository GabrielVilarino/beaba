import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './squadsAdmin.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function VerSquads() {
  const serverUrl = 'http://localhost:3001';
  const [squadsData, setSquadsData] = useState(null);
  const [squadName, setSquadName] = useState('');
  useEffect(() => {
    const obterDadosDasSquads = async () => {
      try {
        const response = await axios.get(`${serverUrl}/squads`);
        setSquadsData(response.data);
      } catch (error) {
        console.error('Erro ao obter nome do usuário:', error);
      }
    };
    obterDadosDasSquads();
  }, []);

  const adicionaSquad = async (e) => {
    try {
      await axios.post(`${serverUrl}/adicionar/squad?nome`, { nome: squadName });
      alert('Squad cadastrada com sucesso!');
      setSquadName('');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar squad', error);
    }
  };

  return (
    <div className='verSquads'>
      <Header />
      <div className='verSquads_Container'>
        <Menu />
        <div className='verSquads_Content'>
          <h1>Squads</h1>
          <div className='adicionarSquads'>
            <label>Adicionar Squad: </label>
            <input
              type='text'
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
            ></input>
            <button onClick={adicionaSquad}>Adicionar</button>
          </div>
          <div className='tabela_Container_Squads'>
            {squadsData ? (
              <table className='tabela_verSquads'>
                <tbody>
                  <tr className='tabela_cabecalho_verSquads'>
                    <th>Nome</th>
                    <th>Membros</th>
                    <th>Uploads</th>
                  </tr>
                  {squadsData.map((squads) => (
                    <tr key={squads.id}>
                      <th>{squads.nome}</th>
                      <th>{squads.totalmembros}</th>
                      <th>{squads.totaluploads}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Carregando dados dos usuários</p>
            )}
          </div>
          <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VerSquads;