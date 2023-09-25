import './addUsuario.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import icone from './assets/iconePerfil.png';
import logout from './assets/logout.png';

function addUsuario() {
  return (
    <div className='addUsuario'>
        <Header />
      <div className='addUsuario__container'>
        <Menu />
        <div className='addUsuario_content'>
            <h1>Adicionar Usuário</h1>
            <img src={icone} alt='Foto Perfil' className='fotoPerfil'></img>
            <button className='buttonAddFoto'>Editar Foto</button>
            <form className='formGrup'>
                <div>
                    <label htmlFor='nome'>Nome:</label>
                    <input type='text'></input>
                </div>
                <div>
                    <label htmlFor='email'>E-mail:</label>
                    <input type='emmail'></input>
                </div>
                <div>
                    <label htmlFor='senha'>Senha:</label>
                    <input type='password'></input>
                </div>
                <div>
                  <label htmlFor='perfil'>Perfil: </label>
                  <select className='tipoPerfil'>
                    <option value=''>Selecionar</option>
                    <option value='admin'>Administrador</option>
                    <option value='user'>Usuário</option>
                  </select>
                </div>
            </form>
            <button className='buttonCadastrar'>Cadastrar</button>
            <a href='/'><img src={logout} alt='Sair' className='logout'></img></a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default addUsuario;