import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return <div className=" capitalize">
    <Routes>
      <Route path='login' element={ <Login/>} />
      <Route path='/*' element={ <Home/>} />
    </Routes>
  </div>;
}

export default App;
