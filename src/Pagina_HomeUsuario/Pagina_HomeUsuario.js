import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Pagina_HomeUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function Pagina_HomeUsuario() {

    const serverUrl = "http://localhost:3001";
    const [templateData, setTemplateData] = useState(null);

    useEffect(() => { 
        const obterDadosDoTemplate = async () => {
          try {
            const response = await axios.get(`${serverUrl}/templates/ativos`);
            setTemplateData(response.data);
          } catch (error) {
            console.error('Erro ao obter dados do Template:', error);
          }
        };
        obterDadosDoTemplate();
      }, []);

  return (
    <div className='Pagina_HomeUsuario'>
      <Header />
      <div className='Pagina_HomeUsuario__container'>
        <Menu />
        <div className='HomeUsuario'>
            <h1>Templates</h1>
            <div className='HomeUsuario__tabela_container'>
            {templateData ?(
            <table className='HomeUsuario__tabela'>
                <tbody>
                    <tr className='HomeUsuario__tabela_cabecalho'>
                        <th>Nome do Template</th>
                        <th>Campos</th>
                        <th>Formato</th>
                        <th>Ações</th>
                    </tr>
                    {templateData.map((template) => (
                        <tr key={template.id}>
                            <th>{template.nome}</th>
                            <th>{template.total_campos}</th>
                            <th>{template.extensao}</th>
                            <th>
                                <button>Download</button>
                                <button>Upload</button>
                            </th>
                        </tr>
                    ))}
                  </tbody>
              </table>
              ) : (
                <p>Carregando dados dos templates</p>
              )}
            </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='HomeUsuario__sair'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default Pagina_HomeUsuario;