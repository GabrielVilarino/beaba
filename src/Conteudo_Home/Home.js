import './Home.css';
import logout from './assets/logout.png'

function Home() {
    return (
      <div className='Home'>
        <div className='Home__content'>
            <h1>Templates</h1>
        </div>
        <div className='Home__tabela_container'>
        <table className='Home__tabela'>
            <tbody>
                <tr className='Home__tabela_cabecalho'>
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
        <a href='/'><img src={logout} alt='Sair' className='Home__sair'></img></a>
      </div>
    );
  }
  
  export default Home;