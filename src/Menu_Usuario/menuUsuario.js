import React, { useEffect, useState } from 'react';
import './menuUsuario.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imagemUsuario from './assets/icone_default.png';
import home from './assets/home.png';

function Menu() {

  const [userName, setUserName] = useState('');
  const[fotoURL, setFotoURL] = useState('');
  const serverUrl = 'http://localhost:3001';
  const userID = localStorage.getItem('userID');
  useEffect(() => {
    if (userID) {
      axios.get(serverUrl + `/usuario/nome?id=${userID}`)
        .then(response => {
          const nomeCompleto = response.data.nome;
          const primeiroNome = nomeCompleto.split(' ')[0];
          setUserName(primeiroNome);
          setFotoURL(response.data.foto);
        })
        .catch(error => {
          console.error('Erro ao obter nome do usuário:', error);
        });
    }
  }, []);
  return (
    <div className='Menu'>
      <div className='Menu__perfil'>
        <img src={fotoURL || imagemUsuario} alt='Imagem Usuario'></img>
        <div className='Menu__perfil_content'>
          <p>Usuário</p>
          <h5>{userName}</h5>
        </div>
      </div>
      <div className='Menu__nav'>
        <nav>
          <ul>
            <li><Link to='/editarPerfilUsuario'>Editar Perfil</Link></li>
            <li><Link to='/solicitaTemplate'>Solicitar Template</Link></li>
            <li><Link to='/squadUsuario'>Squad</Link></li>
            <li><Link to='/uploadUsuario'>Uploads</Link></li>
          </ul>
        </nav>
      </div>
      <a href='/homeUsuario' className='Menu__perfil_home'><img src={home} alt='Imagem Home' ></img></a>
    </div>
  );
}

export default Menu;