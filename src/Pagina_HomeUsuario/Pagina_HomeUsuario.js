import './Pagina_HomeUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu_Usuario/menuUsuario';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function Pagina_HomeUsuario() {
  return (
    <div className='Pagina_HomeUsuario'>
      <Header />
      <div className='Pagina_HomeUsuario__container'>
        <Menu />
        <div className='HomeUsuario'>
            <h1>Templates</h1>
            <div className='HomeUsuario__tabela_container'>
            <table className='HomeUsuario__tabela'>
                <tbody>
                    <tr className='HomeUsuario__tabela_cabecalho'>
                        <th>Nome do Template</th>
                        <th>Campos</th>
                        <th>Formato</th>
                        <th>Ações</th>
                    </tr>
                    <tr>
                        <th>template1</th>
                        <th>8</th>
                        <th>XLSX</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                    <tr>
                        <th>template2</th>
                        <th>5</th>
                        <th>CSV</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                    <tr>
                        <th>template3</th>
                        <th>6</th>
                        <th>XLS</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                    <tr>
                        <th>template4</th>
                        <th>7</th>
                        <th>XLS</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                    <tr>
                        <th>template5</th>
                        <th>4</th>
                        <th>CSV</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                    <tr>
                        <th>template6</th>
                        <th>5</th>
                        <th>XLSX</th>
                        <th>
                            <button>Download</button>
                            <button>Upload</button>
                        </th>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <a href='/'><img src={logout} alt='Sair' className='HomeUsuario__sair'></img></a>
      </div>
      <Footer />
    </div>
  );
}

export default Pagina_HomeUsuario;