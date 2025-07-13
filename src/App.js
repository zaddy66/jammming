// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Callback from './pages/callback';
import Home from './pages/Home';
import AppTest from './components/AppTest/AppTest';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/callback' element={<Callback />} />
        </Routes>
      </BrowserRouter>
      <AppTest />
    </div>
  );
}

export default App;
