import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css';
import { Link } from 'react-router-dom';
import imagemUsuario from './assets/icone_default.png';
import home from './assets/home.png';

function Menu() {
  const [userName, setUserName] = useState('');
  const serverUrl = 'http://localhost:3001';
  const userID = localStorage.getItem('userID');
  useEffect(() => {
    if (userID) {
      axios.get(serverUrl + `/usuario/nome?id=${userID}`)
        .then(response => {
          const nomeCompleto = response.data.nome;
          const primeiroNome = nomeCompleto.split(' ')[0];
          setUserName(primeiroNome);
        })
        .catch(error => {
          console.error('Erro ao obter nome do usuário:', error);
        });
    }
  }, [userID]);

  return (
    <div className='MenuAdmin'>
      <div className='Menu__perfilAdmin'>
        <img src={imagemUsuario} alt='Imagem Usuario'></img>
        <div className='Menu__perfilAdmin_content'>
          <p>Administrador</p>
          <h5>{userName}</h5>
        </div>
      </div>
      <div className='Menu__navAdmin'>
        <nav>
          <ul>
            <li><Link to='/editarPerfil'>Editar Perfil</Link></li>
            <li><Link to='/adicionaUsuario'>Adicionar Usuário</Link></li>
            <li><Link to='/adicionaTemplate'>Adicionar Template</Link></li>
            <li><Link to='/verUsuario'>Usuários</Link></li>
            <li><Link to='/verSquads'>Squads</Link></li>
            <li><Link to='/verTemplate'>Templates</Link></li>
            <li><Link to='/dashboard'>DashBoard</Link></li>
          </ul>
        </nav>
      </div>
      <a href='/home' className='Menu__perfil_home'><img src={home} alt='Imagem Home' ></img></a>
    </div>
  );
}

export default Menu;