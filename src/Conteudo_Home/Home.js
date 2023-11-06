import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './Home.css';
import logout from './assets/logout.png'

function Home() {
  const userID = localStorage.getItem('userID');
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

      const handleDownload = async (template) => {
        try {
          const templateId = template.id;
          const response = await axios.get(`${serverUrl}/templates/${templateId}/campos`);
          const campos = response.data;
      
          const templateNome = template.nome;

          let fileType = ''
          
          switch(template.extensao){
            case 'csv':
              fileType = 'csv';
              break;

            case 'xlsx':
              fileType = 'xlsx';
              break;

            case 'xls':
              fileType = 'xls';
              break;

            default:
              fileType = '';
          }
      
          const fileName = `${templateNome}.${fileType}`;
      
          if (fileType === 'xlsx' || fileType === 'xls') {
            const wsHeader = campos.map(campo => campo.nome);

            const wb = XLSX.utils.book_new();

            const ws = XLSX.utils.aoa_to_sheet([wsHeader]);

            XLSX.utils.book_append_sheet(wb, ws, 'Planilha');

            XLSX.writeFile(wb, fileName);
          } else if (fileType === 'csv') {
            const csvHeader = campos.map(coluna => coluna.nome);

            const csvContent = Papa.unparse({
              fields: csvHeader,
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            fileType = '';
          }
        } catch (error) {
          console.error('Erro ao criar arquivo:', error);
        }
      };

      const handleUpload = async (template) => {
        try {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = '.xlsx, .xls, .csv';
      
          fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
      
            if (file) {
              const formData = new FormData();
              formData.append('file', file);
              
              try {
                const response = await axios.post(`http://127.0.0.1:8000/upload/${template.id}/${userID}`, formData);

                if (response.data.status === 'success') {
                    alert("Upload concluído com sucesso!");
                } else {
                    alert(`Erro no upload: ${response.data.message}`);
                }
              } catch (error) {
                  console.error('Erro ao fazer upload do arquivo:', error);
              }
            }
          });
          fileInput.click();
        } catch (error) {
          console.error('Erro ao fazer upload do arquivo:', error);
        }
      };

    return (
        <div className='Home'>
        <div className='Home__content'>
            <h1>Templates</h1>
        </div>
        <div className='Home__tabela_container'>
            {templateData ?(
        <table className='Home__tabela'>
            <tbody>
                <tr className='Home__tabela_cabecalho'>
                    <th>Nome do Template</th>
                    <th>Squad</th>
                    <th>Campos</th>
                    <th>Formato</th>
                    <th>Ações</th>
                </tr>
                {templateData.map((template) => (
                        <tr key={template.id}>
                            <th>{template.nome}</th>
                            <th>Ainda Fazer</th>
                            <th>{template.total_campos}</th>
                            <th>{template.extensao}</th>
                            <th>
                                <button onClick={() => handleDownload(template)}>Download</button>
                                <button onClick={() => handleUpload(template)}>Upload</button>
                            </th>
                        </tr>
                    ))}
                  </tbody>
              </table>
              ) : (
                <p>Carregando dados dos templates</p>
              )}
        </div>
        <a href='/'><img src={logout} alt='Sair' className='Home__sair'></img></a>
        </div>
    );
    }
  

  export default Home;