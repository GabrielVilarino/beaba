import './editarPerfil.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import button from './assets/buttonEditar.png';
import logout from './assets/logout.png';

function editarPerfil() {
  return (
    <div className='editarPerfil'>
        <Header />
      <div className='editarPerfil__container'>
        <Menu />
        <div className='editarPerfil_content'>
            <h1>Editar Perfil</h1>
            <img src={icone} alt='Foto Perfil' className='fotoPerfil'></img>
            <button className='buttonEditaFoto'>Editar Foto</button>
            <form className='formGrup'>
                <div>
                    <label htmlFor='nome'>Nome:</label>
                    <input type='text'></input>
                    <button className='buttonEditaDados'><img src={button} alt='Imagem Botão'></img></button>
                </div>
                <div>
                    <label htmlFor='email'>E-mail:</label>
                    <input type='emmail'></input>
                    <button className='buttonEditaDados'><img src={button} alt='Imagem Botão'></img></button>
                </div>
                <div>
                    <label htmlFor='senha'>Senha:</label>
                    <input type='password'></input>
                    <button className='buttonEditaDados'><img src={button} alt='Imagem Botão'></img></button>
                </div>  
            </form>
            <button className='buttonSalvar'>Salvar</button>
            <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default editarPerfil;