import './dashboard.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from'./assets/logout.png';

function dashboard() {
  return (
    <div className='dashboard'>
        <Header />
      <div className='dashboard__container'>
        <Menu />
        <div className='dashboard_content'>
            <h1>DashBoard</h1>
            <div className='tabela_container'>
              <table className='tabela'>
                  <tbody>
                    <tr className='tabela_cabecalho'>
                        <th>Nome do Arquivo</th>
                        <th>Campos</th>
                        <th>Linhas</th>
                        <th>Formato</th>
                        <th>Status</th>
                    </tr>
                    <tr>
                        <th>Arquivo 1</th>
                        <th>5</th>
                        <th>150</th>
                        <th>XLSX</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Arquivo 2</th>
                        <th>4</th>
                        <th>80</th>
                        <th>XLS</th>
                        <th>
                            <select className='select'>
                              <option value='ativo'>Ativo</option>
                              <option value='inativo'>Inativo</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Arquivo 3</th>
                        <th>6</th>
                        <th>100</th>
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

export default dashboard;