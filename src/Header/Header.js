import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';
import imagemLogo from './assets/Logo.png';

function Header() {
  const userEmail = localStorage.getItem('userEmail');
  const serverUrl = 'http://localhost:3001';
  const [linkHome, setLinkHome] = useState('');
  useEffect(() => {
    if (userEmail) {
      axios.get(serverUrl + `/usuario/perfil?email=${userEmail}`)
        .then(response => {
          let tipoPerfil = response.data.perfil;

          if (tipoPerfil === 'admin') {
            setLinkHome('/home');
          } else {
            setLinkHome('/homeUsuario');
          }

        })

        .catch(error => {
          console.error('Erro ao obter perfil do usuário:', error);
        });
    }
  }, [userEmail]);
  return (
    <div className='Header'>
      <div className='Header__Logo'>
        <a href={linkHome}><img src={imagemLogo} alt='Imagem Logo'></img></a>
      </div>
    </div>
  );
}

export default Header;