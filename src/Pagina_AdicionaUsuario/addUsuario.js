import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './addUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import logout from './assets/logout.png';

function AddUsuario() {
  const serverUrl = 'http://localhost:3001';
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: '',
    squad: ''
  });
  const [squadsData, setSquadsData] = useState([]);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    async function squads() {
      try {
        const response = await axios.get(serverUrl + '/squads');
        setSquadsData(response.data);
      } catch (error) {
        console.error('Erro ao buscar squads: ', error);
      }
    }

    squads();
  }, [serverUrl]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if(formData.nome === '' || formData.email === '' || formData.senha  === '' || formData.perfil === '' || formData.squad === '') {
      alert('Preencha todos os campos!');
    }

    const emailCheckResponse = await axios.get(
      `${serverUrl}/verifica/email?email=${formData.email}`
    );

    if (emailCheckResponse.data.exists) {
      alert('E-mail já cadastrado. Escolha outro e-mail.');
      setEmailExists(true);
      return;
    }

    try{
      const response = await axios.post(serverUrl + '/usuario/cadastro', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        perfil: formData.perfil,
        squad: formData.squad
      });
      if(response.status === 200) {
        alert('Usuário cadastrado com sucesso');

        setFormData({
          nome: '',
          email: '',
          senha: '',
          perfil: '',
          squad: ''
        });

        setEmailExists(false);
      }

    }catch(error) {
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
              <label htmlFor='squad'>Squad: </label>
              <select className='tipoSquad' name='squad' value={formData.squad} onChange={handleChange}>
                <option value=''>Selecionar</option>
                {squadsData.map((squad) => (
                  <option key={squad.id} value={squad.id}>{squad.nome}</option>
                ))}
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