import './Menu.css';
import { Link } from 'react-router-dom';
import imagemUsuario from './assets/icone_default.png'
import home from './assets/home.png'

function Menu() {
    return (
      <div className='Menu'>
        <div className="Menu__perfil">
          <img src={imagemUsuario} alt='Imagem Usuario'></img>
            <div className='Menu__perfil_content'>
              <p>Administrador</p>
              <h5>Gabriel Vilarino</h5>
            </div>
        </div>
        <div className="Menu__nav">
            <nav>
              <ul>
                <li><Link to='/editarPerfil'>Editar Perfil</Link></li>
                <li><Link to='/adicionaUsuario'>Adicionar Usuário</Link></li>
                <li><Link to='/adicionaTemplate'>Adicionar Template</Link></li>
                <li><Link to='/verUsuario'>Ver Usuário</Link></li>
                <li><Link to='/verTemplate'>Ver Template</Link></li>
                <li><Link to='/dashboard'>DashBoard</Link></li>
              </ul>
            </nav>
        </div>
        <a href='/home' className='Menu__perfil_home'><img src={home} alt='Imagem Home' ></img></a>
      </div>
    );
  }
  
  export default Menu;