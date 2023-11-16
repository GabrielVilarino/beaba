import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pagina_Login/Login';
import Home from './Pagina_Home/Pagina_Home';
import Perfil from './Pagina_EditaPerfil/editarPerfil';
import AddUsuario from './Pagina_AdicionaUsuario/addUsuario';
import AddTemplate from './Pagina_AdicionaTemplate/addTemplate';
import VerUsuario from './Pagina_VerUsuario/verUsuario';
import VerSquads from './Pagina_SquadsAdmin/squadsAdmin';
import VerTemplate from './Pagina_VerTemplate/verTemplate';
import Dashboard from './Pagina_Dashboard/dashboard';
import HomeUsuario from './Pagina_HomeUsuario/Pagina_HomeUsuario';
import PerfilUsuario from './Pagina_EditaPerfilUsuario/editarPerfilUsuario';
import SolicitaTemplate from './Pagina_SolicitaTemplate/solicitaTemplate';
import SquadUsuario from './Pagina_SquadUsuario/squadUsuario';
import UploadUsuario from './Pagina_UploadsUsuario/uploadUsuario';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element ={<Login />}></Route>
          <Route path='/home' element ={<Home />}></Route>
          <Route path='/editarPerfil' element ={<Perfil />}></Route>
          <Route path='/adicionaUsuario' element ={<AddUsuario />}></Route>
          <Route path='/adicionaTemplate'element ={<AddTemplate />}></Route>
          <Route path='/verUsuario' element ={<VerUsuario />}></Route>
          <Route path='/verSquads' element ={<VerSquads />}></Route>
          <Route path='/verTemplate' element ={<VerTemplate />}></Route>
          <Route path='/dashboard' element ={<Dashboard />}></Route>
          <Route path='/homeUsuario' element={<HomeUsuario />}></Route>
          <Route path='/editarPerfilUsuario' element ={<PerfilUsuario />}></Route>
          <Route path='/solicitaTemplate' element={<SolicitaTemplate />}></Route>
          <Route path='/squadUsuario' element={<SquadUsuario />}></Route>
          <Route path='/uploadUsuario' element={<UploadUsuario />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
