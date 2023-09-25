import './verUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import logout from './assets/logout.png';

function verUsuario() {
  return (
    <div className='verUsuario'>
        <Header />
      <div className='verUsuario__container'>
        <Menu />
        <div className='verUsuario_content'>
            <h1>Ver Usuários</h1>
            <div className='tabela_container'>
              <table className='tabela'>
                  <tbody>
                    <tr className='tabela_cabecalho'>
                        <th>Nome Completo</th>
                        <th>E-mail</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Gabriel Vilarino Gonçalves</th>
                        <th>gabrielvilarino@hotmail.com</th>
                        <th>Administrador</th>
                        <th>
                            <button>Usuário</button>
                            <button>Administrador</button>
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

export default verUsuario;