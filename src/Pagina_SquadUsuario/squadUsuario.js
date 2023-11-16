import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './squadUsuario.css';
import Header from '../Header/Header';
import MenuUsuario from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function SquadUsuario() {
  const serverUrl = 'http://localhost:3001';
  const [squadData, setSquadData] = useState(null);
  const userIDSquad = localStorage.getItem('userIDSquad');
  useEffect(() => {
    const obterDadosDaSquad = async () => {
      try {
        const response = await axios.get(`${serverUrl}/squad/usuarios?idSquad=${userIDSquad}`);
        setSquadData(response.data);
      } catch (error) {
        console.error('Erro ao obter nome do usuário:', error);
      }
    };
    obterDadosDaSquad();
  }, []);

  return (
    <div className='squadUsuario'>
      <Header />
      <div className='squadUsuario__container'>
        <MenuUsuario />
        <div className='squadUsuario_content'>
          <h1>Squad</h1>
          <div className='tabela_container'>
            {squadData ? (
              <table className='tabela'>
                <tbody>
                  <tr className='tabela_cabecalho'>
                    <th>Nome Completo</th>
                    <th>E-mail</th>
                    <th>Perfil</th>
                  </tr>
                  {squadData.map((squad) => (
                    <tr key={squad.id}>
                      <th>{squad.nome}</th>
                      <th>{squad.email}</th>
                      <th>{squad.perfil === 'admin' ? 'Administrador' : 'Usuário'}</th>
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

export default SquadUsuario;