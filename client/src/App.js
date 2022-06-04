import './App.css';
import Editor from './Editor';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <Router className=''>
      <Routes>
        <Route path='/' element={<Navigate to={`/doc/${uuidv4()}`} />} />
        <Route path='/doc/:id' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
