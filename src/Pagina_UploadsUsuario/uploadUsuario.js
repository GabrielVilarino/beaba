import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './uploadUsuario.css';
import Header from '../Header/Header';
import MenuUsuario from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from'./assets/logout.png';

function UploadUsuario() {
  const [uploadsData, setUploadsData] = useState(null);
  const userID = localStorage.getItem('userID');
  useEffect(() => {
    const obterDadosDosUploads = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/usuario/uploads/${userID}`);
        setUploadsData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados dos Arquivos:', error);
      }
    };
    obterDadosDosUploads();
  }, []);

  function formatarData(dataString, fusoHorario = 'UTC') {
    const dataUTC = new Date(dataString + 'Z');
    const opcoes = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: fusoHorario,
    };

    return dataUTC.toLocaleDateString('pt-BR', opcoes);
  }

  return (
    <div className='uploadUsuario'>
      <Header />
      <div className='uploadUsuario__container'>
        <MenuUsuario />
        <div className='uploadUsuario_content'>
          <h1>Uploads</h1>
          <div className='tabela_container'>
            {uploadsData ?(
              <table className='tabela'>
                <tbody>
                  <tr className='tabela_cabecalho'>
                    <th>Nome do Arquivo</th>
                    <th>Extensão</th>
                    <th>Data de Upload</th>
                    <th>Template</th>
                    <th>Ação</th>
                  </tr>
                  {uploadsData.map((uploads) => (
                    <tr key={uploads.id}>
                      <th>{uploads.nome}</th>
                      <th>{uploads.extensao}</th>
                      <th>{formatarData(uploads.dataUpload, 'America/Sao_Paulo')}</th>
                      <th>{uploads.status}</th>
                      <th>
                        <a href={uploads.path} download>
                          <button>Download</button>
                        </a>
                      </th>
                    </tr>
                  ))}

                </tbody>
              </table>
            ) : (
              <p>Carregando dados dos uploads</p>
            )}
          </div>
          <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UploadUsuario;