// import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResults';
import Tracklist from './components/Tracklist';

function App() {
  return (
    <div className='App'>
      <SearchBar />
      <div className='bottom-column'>
        <SearchResult />
        <Tracklist />
      </div>
    </div>
  );
}

export default App;
