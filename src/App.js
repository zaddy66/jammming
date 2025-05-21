// import logo from './logo.svg';
import './App.css';
import songLists from './components/list';
import SearchComponent from './components/search';

function App() {
  return (
    <div className='App'>
      <SearchComponent details={songLists} />
    </div>
  );
}

export default App;
