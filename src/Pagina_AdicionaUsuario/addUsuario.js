import axios from 'axios';
import React, { useState } from 'react';
import './addUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import logout from './assets/logout.png';

function AddUsuario() {
  const serverUrl = "http://localhost:3001";
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: ''
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if(formData.nome === '' || formData.email === '' || formData.senha  === '' || formData.perfil === ''){
      alert("Preencha todos os campos!");
    }

    try{
      const response = await axios.post(serverUrl + '/usuario/cadastro', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        perfil: formData.perfil
      });
      if(response.status === 200){
        alert('Usuário cadastrado com sucesso');

        setFormData({
          nome: '',
          email: '',
          senha: '',
          perfil: ''
        });
      }

    }catch(error){
      console.error('Erro ao cadastrar usuario: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='addUsuario'>
        <Header />
      <div className='addUsuario__container'>
        <Menu />
        <div className='addUsuario_content'>
            <h1>Adicionar Usuário</h1>
            <img src={icone} alt='Foto Perfil' className='fotoPerfil'></img>
            <button className='buttonAddFoto'>Editar Foto</button>
            <form className='formGrup' onSubmit={onSubmit}>
                <div>
                    <label htmlFor='nome'>Nome:</label>
                    <input type='text' name='nome' value={formData.nome} onChange={handleChange}></input>
                </div>
                <div>
                    <label htmlFor='email'>E-mail:</label>
                    <input type='emmail' name='email' value={formData.email} onChange={handleChange}></input>
                </div>
                <div>
                    <label htmlFor='senha'>Senha:</label>
                    <input type='password' name='senha' value={formData.senha} onChange={handleChange}></input>
                </div>
                <div>
                  <label htmlFor='perfil'>Perfil: </label>
                  <select className='tipoPerfil' name='perfil' value={formData.perfil} onChange={handleChange}>
                    <option value=''>Selecionar</option>
                    <option value='admin'>Administrador</option>
                    <option value='user'>Usuário</option>
                  </select>
                </div>
                <button className='buttonCadastrar'>Cadastrar</button>
            </form>
            <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddUsuario;