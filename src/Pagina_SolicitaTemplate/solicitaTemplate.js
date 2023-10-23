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
  const userID = localStorage.getItem('userID');
  const serverUrl = "http://localhost:3001";
  useEffect(() => { 
    const obterNomeDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuario/nome?id=${userID}`);
        setUserName(JSON.stringify(response.data.nome));
      } catch (error) {
        console.error('Erro ao obter ID do usuário:', error);
      }
    };

    obterNomeDoUsuario();
  }, [userID]);

  function addCampos(){
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
    try {

      const serviceId = 'service_htunprj';
      const templateId = 'template_2t5z8f2';
      const userId = 'WX2m4Agv7BDZUXQV3';

      const templateParams = {
        to_email: 'gabriel_vilarino@hotmail.com',
        nome_template: cadTemplate.nome,
        extensao: cadTemplate.extensao,
        campos: JSON.stringify(camposTemplate),
        from_name: userName
      };
      alert(JSON.stringify(templateParams));
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