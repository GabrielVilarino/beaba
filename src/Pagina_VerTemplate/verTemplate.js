import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './verTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function VerTemplate() {
  const serverUrl = 'http://localhost:3001';
  const [templateData, setTemplateData] = useState(null);

  useEffect(() => {
    const obterDadosDoTemplate = async () => {
      try {
        const response = await axios.get(`${serverUrl}/templates`);
        setTemplateData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados do Template:', error);
      }
    };
    obterDadosDoTemplate();
  }, []);

  const handleStatusChange = async (templateId, newStatus) => {
    try {
      await axios.put(`${serverUrl}/templates/${templateId}`, { status: newStatus });

      setTemplateData((prevData) =>
        prevData.map((template) =>
          template.id === templateId ? { ...template, status: newStatus } : template
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status do template:', error);
    }
  };

  function formatarNomeUsuario(nomeCompleto) {
    let partes = nomeCompleto.split(' ');
    let nome = partes.slice(0, 2).join(' ');
    return nome;
  }

  return (
    <div className='verTemplate'>
      <Header />
      <div className='verTemplate__container'>
        <Menu />
        <div className='verTemplate_content'>
          <h1>Templates</h1>
          <div className='tabela_container'>
            {templateData ? (
              <table className='tabela'>
                <tbody>
                  <tr className='tabela_cabecalho'>
                    <th>Nome do Template</th>
                    <th>Criador</th>
                    <th>Squad</th>
                    <th>Campos</th>
                    <th>Formato</th>
                    <th>Status</th>
                  </tr>
                  {templateData.map((template) => (
                    <tr key={template.id}>
                      <th>{template.nome}</th>
                      <th>{formatarNomeUsuario(template.nomeusuario)}</th>
                      <th>{template.nomesquad}</th>
                      <th>{template.total_campos}</th>
                      <th>{template.extensao}</th>
                      <th>
                        <select
                          className='select'
                          value={template.status}
                          onChange={(e) => handleStatusChange(template.id, e.target.value)}>
                          <option value='ativo'>Ativo</option>
                          <option value='inativo'>Inativo</option>
                        </select>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Carregando dados dos templates</p>
            )}
          </div>
          <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VerTemplate;