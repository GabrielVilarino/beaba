import './menuUsuario.css';
import { Link } from 'react-router-dom';
import imagemUsuario from './assets/icone_default.png'
import home from './assets/home.png'

function Menu() {
    return (
      <div className='Menu'>
        <div className="Menu__perfil">
          <img src={imagemUsuario} alt='Imagem Usuario'></img>
            <div className='Menu__perfil_content'>
              <p>Usuário</p>
              <h5>Isabella Araújo</h5>
            </div>
        </div>
        <div className="Menu__nav">
            <nav>
              <ul>
                <li><Link to='/editarPerfilUsuario'>Editar Perfil</Link></li>
                <li><Link to='/solicitaTemplate'>Solicitar Template</Link></li>
              </ul>
            </nav>
        </div>
        <a href='/homeUsuario' className='Menu__perfil_home'><img src={home} alt='Imagem Home' ></img></a>
      </div>
    );
  }
  
  export default Menu;