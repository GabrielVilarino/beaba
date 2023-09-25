import './verTemplate.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function verTemplate() {
  return (
    <div className='verTemplate'>
        <Header />
      <div className='verTemplate__container'>
        <Menu />
        <div className='verTemplate_content'>
            <h1>Ver Templates</h1>
            <div className='tabela_container'>
              <table className='tabela'>
                 <tbody>
                    <tr className='tabela_cabecalho'>
                        <th>Nome do Template</th>
                        <th>Campos</th>
                        <th>Formato</th>
                        <th>Status</th>
                    </tr>
                    <tr>
                        <th>Template 1</th>
                        <th>5</th>
                        <th>XLSX</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Template 2</th>
                        <th>4</th>
                        <th>XLS</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Template 3</th>
                        <th>6</th>
                        <th>CSV</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
                 </tbody>
              </table>
            </div>
            <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default verTemplate;