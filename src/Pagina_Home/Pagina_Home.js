import './Pagina_Home.css';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import Home from '../Conteudo_Home/Home';

function Pagina_Home() {
  return (
    <div className='Pagina_Home'>
      <Header />
      <div className='Pagina_Home__container'>
        <Menu />
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default Pagina_Home;