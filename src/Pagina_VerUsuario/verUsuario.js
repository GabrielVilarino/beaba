import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './verUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function VerUsuario() {
  const serverUrl = "http://localhost:3001";
  const [userData, setUserData] = useState(null);
  useEffect(() => { 
    const obterDadosDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuarios`);
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao obter nome do usuário:', error);
      }
    };
    obterDadosDoUsuario();
  }, []);

  const atualizaPerfilAdmin = async (e, userEmail) => {
    try {
      await axios.put(`${serverUrl}/usuario/admin?email`, { email: userEmail });
      alert('Permissão alterada com sucesso!');
      window.location.reload()
    } catch (error) {
      console.error('Erro ao alterar permissão do usuário:', error);
    }
  };

  const atualizaPerfilComum = async (e, userEmail) => {
    try {
      await axios.put(`${serverUrl}/usuario/comum?email`, { email: userEmail });
      alert('Permissão alterada com sucesso!');
      window.location.reload()
    } catch (error) {
      console.error('Erro ao alterar permissão do usuário:', error);
    }
  };

  return (
    <div className='verUsuario'>
        <Header />
      <div className='verUsuario__container'>
        <Menu />
        <div className='verUsuario_content'>
            <h1>Ver Usuários</h1>
            <div className='tabela_container'>
              {userData ? (
                <table className='tabela'>
                  <tbody>
                    <tr className='tabela_cabecalho'>
                        <th>Nome Completo</th>
                        <th>E-mail</th>
                        <th>Squad</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                    {userData.map((user) => (
                        <tr key={user.id}>
                            <th>{user.nome}</th>
                            <th>{user.email}</th>
                            <th>Ainda Fazer</th>
                            <th>{user.perfil === 'admin' ? 'Administrador' : 'Usuário'}</th>
                            <th>
                                <button onClick={(e) => atualizaPerfilAdmin(e, user.email)}>Administrador</button>
                                <button onClick={(e) => atualizaPerfilComum(e, user.email)}>Usuário</button>
                            </th>
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

export default VerUsuario;