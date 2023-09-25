import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import foto from './assets/Foto.png';

function Login() {
  
  const navigate = useNavigate();

  let email = '';
  let password = '';

  const onSubmit = (e) => {
    email = e.target.elements.email.value;
    password = e.target.elements.password.value;

    if( email === 'gabrielvilarino@hotmail.com' && password === '1234'){
      navigate('/home');
    }else if(email === 'gabrielvilarino@hotmail.com' && password === '123'){
      navigate('/homeUsuario');
    }else{
      console.log('erro')
    }
  }

    return (
    <div className='Login'>
      <Header />
      <div className='Pagina_Login__container'>
        <img src={foto} alt='foto'></img>
        <div className='Pagina_Login_content'>
          <h1>Bem-Vindo!</h1>
          <form onSubmit={onSubmit}>
            <div className='formGrupo'>
              <label htmlFor='email'>E-mail:</label>
              <input type='text' name='email'></input>
            </div>
            <div className='formGrupo'>
              <label htmlFor='senha'>Senha:</label>
              <input type='password' name='password'></input>
            </div>
            <button className='buttonEntrar'>Entrar</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;