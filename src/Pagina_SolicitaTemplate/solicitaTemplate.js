import './solicitaTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function solicitaTemplate() {
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
                  <input type='text'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='nomeColuna'>Nome da Coluna: </label>
                  <input type='text'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='tipoCampo'>Tipo do Campo: </label>
                  <input type='text' className='tipoCampo'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='nomeColuna'>Nome da Coluna: </label>
                  <input type='text'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='tipoCampo'>Tipo do Campo: </label>
                  <input type='text' className='tipoCampo'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='nomeColuna'>Nome da Coluna: </label>
                  <input type='text'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='tipoCampo'>Tipo do Campo: </label>
                  <input type='text' className='tipoCampo'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='nomeColuna'>Nome da Coluna: </label>
                  <input type='text'></input>
              </div>
              <div className='content-1'>
                  <label htmlFor='tipoCampo'>Tipo do Campo: </label>
                  <input type='text' className='tipoCampo'></input>
              </div>
            </div>
        </div>
        <div className='content-2'>
              <div className='content-2-container'>
                <select>
                  <option value='csv'>CSV</option>
                  <option value='xls'>XLS</option>
                  <option value='xlsx'>XLSX</option>
                </select>
                <input type='number' placeholder='Digite o Número de Colunas'></input>
                  <button>Adicionar</button>
                  <button>Solicitar</button>
              </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default solicitaTemplate;