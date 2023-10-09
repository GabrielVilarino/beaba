import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import foto from './assets/Foto.png';

function Login() {
  const serverUrl = "http://localhost:3001";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if(formData.email === '' || formData.senha  === ''){
      alert("Preencha todos os campos!");
    }

    try{
      const response = await axios.post(serverUrl + '/login', {
        email: formData.email,
        senha: formData.senha,
      });

      if(response.data.authenticated){
        const {perfil} = response.data.user;
        switch (perfil){
          case 'admin':
            navigate('/home');
            break;
          case 'user':
            navigate('/homeUsuario');
            break;
          default:
            navigate('/');
        }
      }
    }catch(error){
      console.error('Erro ao fazer login: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    return (
    <div className='Login'>
      <Header />
      <div className='Pagina_Login__container'>
        <img src={foto} alt='foto'></img>
        <div className='Pagina_Login_content'>
          <h1>Bem-Vindo!</h1>
          <form onSubmit={onSubmit}>
            <div className='formGrupo'>
              <label htmlFor='email'>E-mail:</label>
              <input type='text' name='email' value={formData.email} onChange={handleChange}></input>
            </div>
            <div className='formGrupo'>
              <label htmlFor='senha'>Senha:</label>
              <input type='password' name='senha' value={formData.senha} onChange={handleChange}></input>
            </div>
            <button className='buttonEntrar'>Entrar</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;