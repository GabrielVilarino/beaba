import './Header.css';
import imagemLogo from './assets/Logo.png'

function Header() {
  return (
    <div className='Header'>
        <div className="Header__Logo">
          <a href='/home'><img src={imagemLogo} alt='Imagem Logo'></img></a>
        </div>
    </div>
  );
}

export default Header;