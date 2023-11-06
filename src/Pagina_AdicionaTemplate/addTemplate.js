import axios from 'axios';
import React, { useEffect ,useState, useRef } from 'react';
import './addTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function AddTemplate() {
  const serverUrl = "http://localhost:3001";
  const userEmail = localStorage.getItem('userEmail');
  const [numColunas, setNumColunas] = useState(1);
  const [cadTemplate, setCadTemplate] = useState({
    nome: '',
    extensao: ''
  });
  const [camposTemplate, setCamposTemplate] = useState([]);

  var userID = useRef(null);
  useEffect(() => { 
    const obterIdDoUsuario = async () => {
      try {
        const response = await axios.get(`${serverUrl}/usuario/perfil?email=${userEmail}`);
        const { id } = response.data;
        userID.current = id;
      } catch (error) {
        console.error('Erro ao obter ID do usuário:', error);
      }
    };

    if (userEmail) {
      obterIdDoUsuario();
    }
  }, [userEmail]);

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
            <option value='Timestamp'>Data</option>
          </select>
        </div>
      );
    }
    return colunas;
  }

  const addTemplate = async (e) => {
    e.preventDefault();
    var idTemplate;
    
    if(cadTemplate.nome === '' || cadTemplate.extensao === '' || numColunas <= 0 || numColunas === undefined){
      alert("Preencha todos os campos!");
      return;
    }

    for (let i = 0; i < numColunas; i++) {
      let nomeCampo = camposTemplate[i].nomeColuna;
      let tipoCampo = camposTemplate[i].tipoCampo;
      if(nomeCampo === '' || tipoCampo === undefined || nomeCampo === undefined || tipoCampo === ''){
        alert('Preencha todos os campos');
        return;
      }
    }
    
    //POST de template
    try{
      const response = await axios.post(serverUrl + '/template/cadastro', {
        nome: cadTemplate.nome,
        extensao: cadTemplate.extensao,
        idUsuario: userID.current
      });

      if(response.status === 200){
        alert('Template cadastrado com sucesso');
        idTemplate = response.data.id.id;
        setCadTemplate({
          nome: '',
          extensao: '',
        });
      }

    }catch(error){
      console.error('Erro ao cadastrar template: ', error);
    }

    //POST campos

    for (let i = 0; i < numColunas; i++) {
      let nomeCampo = camposTemplate[i].nomeColuna;
      let tipoCampo = camposTemplate[i].tipoCampo;
      console.log("Dados a serem enviados:", { nome: nomeCampo, tipo: tipoCampo, idTemplate: idTemplate });

      try{
        const response = await axios.post(serverUrl + '/template/cadastro/campos', {
          nome: nomeCampo,
          tipo: tipoCampo,
          idTemplate: idTemplate
        });
  
        if(response.status === 200){
          setCamposTemplate([]);
        }
  
      }catch(error){
        console.error('Erro ao cadastrar campos: ', error);
      }
    }

    setNumColunas(1);
  };

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

  return (
    <div className='addTemplate'>
        <Header />
      <div className='addTemplate__container'>
        <Menu />
        <div className='addTemplate_content'>
            <h1>Adicionar Template</h1>
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
                  <button onClick={addTemplate}>Adicionar</button>
              </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default AddTemplate;