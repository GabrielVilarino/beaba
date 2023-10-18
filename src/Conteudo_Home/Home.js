import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './Home.css';
import logout from './assets/logout.png'

function Home() {
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
                                <button onClick={() => handleDownload(template)}>Download</button>
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
        <a href='/'><img src={logout} alt='Sair' className='Home__sair'></img></a>
        </div>
    );
    }
  
/*
<tr>
                    <th>template1</th>
                    <th>8</th>
                    <th>XLSX</th>
                    <th>
                        <button>Download</button>
                        <button>Upload</button>
                    </th>
                </tr>
*/

  export default Home;