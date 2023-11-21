import axios from 'axios';
import React, { useEffect ,useState, useRef } from 'react';
import './editarPerfilUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import logout from './assets/logout.png';

function EditarPerfilUsuario() {
  const serverUrl = 'http://localhost:3001';
  const userEmail = localStorage.getItem('userEmail');
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    foto: ''
  });
  let userID = useRef(null);
  useEffect(() => {
    const obterDadosDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuario/perfil?email=${userEmail}`);
        const { nome, email, senha, foto, id } = response.data;
        userID.current = id;
        setFormData({
          nome: nome,
          email: email,
          senha: senha,
          foto: foto
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
      const formData = new FormData();
      const inputFile = document.querySelector('input[type="file"]');

      if (inputFile && inputFile.files && inputFile.files.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append('file', inputFile.files[0]);

        const imageResponse = await axios.post(`http://127.0.0.1:8000/upload_foto_perfil/${userID.current}`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (imageResponse.data.status === 'success') {
          setFormData((prevData) => ({
            ...prevData,
            foto: imageResponse.data.photo_url
          }));

          await axios.put('http://127.0.0.1:8000/usuario/atualiza_foto_perfil', {
            id: userID.current,
            fotoPerfilUrl: imageResponse.data.photo_url
          });

          setPreviewImage(null);
        } else {
          alert('Erro ao atualizar a foto de perfil: ' + imageResponse.data.message);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar a foto de perfil:', error);
    }

    try {
      await axios.put(`${serverUrl}/usuario/editaperfil?id`, { id: userID.current, ...formData });
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const handleSelecionaFoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='editarPerfilUsuario'>
      <Header />
      <div className='editarPerfilUsuario__container'>
        <Menu />
        <div className='editarPerfilUsuario_content'>
          <h1>Editar Perfil</h1>
          <input
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={handleSelecionaFoto}
          />
          <img src={previewImage || formData.foto || icone} alt='Foto Perfil' className='fotoPerfil'></img>
          <button className='buttonEditaFoto' onClick={() => document.querySelector('input[type="file"]').click()}>Editar Foto</button>
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

export default EditarPerfilUsuario;