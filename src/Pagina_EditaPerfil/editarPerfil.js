import axios from 'axios';
import React, { useEffect ,useState, useRef } from 'react';
import './editarPerfil.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import logout from './assets/logout.png';

function EditarPerfil() {
  const serverUrl = 'http://localhost:3001';
  const userEmail = localStorage.getItem('userEmail');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  let userID = useRef(null);
  useEffect(() => {
    const obterDadosDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuario/perfil?email=${userEmail}`);
        const { nome, email, senha, id } = response.data;
        userID.current = id;
        setFormData({
          nome: nome,
          email: email,
          senha: senha
        });
      } catch (error) {
        console.error('Erro ao obter nome do usuário:', error);
      }
    };

    if (userEmail) {
      obterDadosDoUsuario();
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log('formData após handleInputChange:', formData);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${serverUrl}/usuario/editaperfil?id`, { id: userID.current, ...formData });
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <div className='editarPerfil'>
      <Header />
      <div className='editarPerfil__container'>
        <Menu />
        <div className='editarPerfil_content'>
          <h1>Editar Perfil</h1>
          <img src={icone} alt='Foto Perfil' className='fotoPerfil'></img>
          <button className='buttonEditaFoto'>Editar Foto</button>
          <form className='formGrup' onSubmit={handleSave}>
            <div>
              <label htmlFor='nome'>Nome:</label>
              <input type='text' defaultValue={formData.nome} onChange={handleInputChange} name='nome'></input>
            </div>
            <div>
              <label htmlFor='email'>E-mail:</label>
              <input type='email' defaultValue={formData.email} onChange={handleInputChange} name='email'></input>
            </div>
            <div>
              <label htmlFor='senha'>Senha:</label>
              <input type='password' defaultValue={formData.senha} onChange={handleInputChange} name='senha'></input>
            </div>
            <button className='buttonSalvar'>Salvar</button>
          </form>
          <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditarPerfil;