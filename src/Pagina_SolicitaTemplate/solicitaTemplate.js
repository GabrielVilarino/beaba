import axios from 'axios';
import React, { useEffect ,useState } from 'react';
import './solicitaTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';
import emailjs from 'emailjs-com';

function SolicitaTemplate() {
  const [numColunas, setNumColunas] = useState(1);
  const [cadTemplate, setCadTemplate] = useState({
    nome: '',
    extensao: ''
  });
  const [camposTemplate, setCamposTemplate] = useState([]);
  const [userName, setUserName] = useState('');
  const [userAdminData, setUserAdminData] = useState('');
  const userID = localStorage.getItem('userID');
  const userIDSquad = localStorage.getItem('userIDSquad');
  const serverUrl = 'http://localhost:3001';
  useEffect(() => {
    const obterNomeDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuario/nome?id=${userID}`);
        setUserName(response.data.nome);
      } catch (error) {
        console.error('Erro ao obter ID do usuário:', error);
      }
    };

    const obterEmailDoAdmin = async () => {
      try {
        const response = await axios.get(`${serverUrl}/admin/email?idsquad=${userIDSquad}`);
        setUserAdminData(response.data);
      } catch (error) {
        console.error('Erro ao obter Squad do usuário:', error);
      }
    };
    obterEmailDoAdmin();
    obterNomeDoUsuario();
  }, [userIDSquad]);

  function addCampos() {
    const colunas = [];
    for (let i = 0; i < numColunas; i++) {
      colunas.push(
        <div key={i} className='content-1'>
          <label htmlFor={`nomeColuna${i}`}>Nome da Coluna: </label>
          <input
            type='text'
            id={`nomeColuna${i}`}
            name='nomeColuna'
            value={camposTemplate[i]?.nomeColuna || ''}
            onChange={(e) => handleChangeCampos(e, i)}/>
          <br></br>
          <label htmlFor={`tipoCampo${i}`}>Tipo do Campo: </label>
          <select
            id={`tipoCampo${i}`}
            className='tipoCampo'
            name='tipoCampo'
            value={camposTemplate[i]?.tipoCampo || ''}
            onChange={(e) => handleChangeCampos(e, i)}
          >
            <option value=''>Selecionar</option>
            <option value='int64'>Inteiro</option>
            <option value='float64'>Decimal</option>
            <option value='bool'>Booleano</option>
            <option value='object'>Texto</option>
            <option value='datetime64'>Data</option>
          </select>
        </div>
      );
    }
    return colunas;
  }

  const handleChange = (e) => {
    setCadTemplate({
      ...cadTemplate,
      [e.target.name]: e.target.value,
    });
  };

  function handleChangeCampos(e, index) {
    const { name, value } = e.target;
    setCamposTemplate((prevCampos) => {
      const novosCampos = [...prevCampos];
      if (!novosCampos[index]) {
        novosCampos[index] = {};
      }
      novosCampos[index][name] = value;
      return novosCampos;
    });
  }

  const enviarEmail = async () => {

    if(cadTemplate.nome === '' || cadTemplate.extensao === '' || numColunas <= 0 || numColunas === undefined) {
      alert('Preencha todos os campos!');
      return;
    }

    for (let i = 0; i < numColunas; i++) {
      let nomeCampo = camposTemplate[i].nomeColuna;
      let tipoCampo = camposTemplate[i].tipoCampo;
      if(nomeCampo === '' || tipoCampo === undefined || nomeCampo === undefined || tipoCampo === '') {
        alert('Preencha todos os campos');
        return;
      }
    }
    try {
      const serviceId = 'service_htunprj';
      const templateId = 'template_2t5z8f2';
      const userId = 'WX2m4Agv7BDZUXQV3';

      const templateParams = {
        to_email: userAdminData.email,
        to_name: userAdminData.nome,
        from_name: userName,
        nome_template: cadTemplate.nome,
        numero_campos: numColunas,
        extensao: cadTemplate.extensao,
        campos: JSON.stringify(camposTemplate),
      };
      alert(`Solicitação será enviada para o email: ${userAdminData.email}`);
      await emailjs.send(serviceId, templateId, templateParams, userId);

      alert('E-mail enviado com sucesso!');
      setCadTemplate({
        nome: '',
        extensao: '',
      });
      setCamposTemplate([]);
      setNumColunas(1);
    } catch (error) {
      alert('Erro ao enviar o e-mail:', error);
    }
  };

  return (
    <div className='solicitaTemplate'>
      <Header />
      <div className='solicitaTemplate__container'>
        <Menu />
        <div className='solicitaTemplate_content'>
          <h1>Solicitar Template</h1>
          <div className='content-1-container'>
            <div className='content-1-fixo'>
              <label htmlFor='nomeTemplate'>Nome do Template: </label>
              <input type='text' name='nome' value={cadTemplate.nome} onChange={handleChange}></input>
            </div>
            {addCampos()}
          </div>
        </div>
        <div className='content-2'>
          <div className='content-2-container'>
            <select name='extensao' onChange={handleChange} value={cadTemplate.extensao}>
              <option value=''>Selecionar</option>
              <option value='csv'>CSV</option>
              <option value='xls'>XLS</option>
              <option value='xlsx'>XLSX</option>
            </select>
            <input
              type='number'
              placeholder='Digite o Número de Colunas'
              value={numColunas}
              min={1}
              onChange={(e) => setNumColunas(e.target.value)}></input>
            <button onClick={enviarEmail}>Solicitar</button>
          </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default SolicitaTemplate;