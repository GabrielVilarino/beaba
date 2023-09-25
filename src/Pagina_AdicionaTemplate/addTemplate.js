import './addTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function addTemplate() {
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
                  <button>Confirmar</button>
              </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default addTemplate;