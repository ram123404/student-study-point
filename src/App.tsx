
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Resources from './pages/Resources';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <nav className="bg-blue-500 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-xl font-bold">StudyPoint</Link>
            <div>
              <Link to="/resources" className="mr-4 hover:underline">Resources</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mx-auto p-4">
              <h1 className="text-3xl font-bold mb-4">Welcome to StudyPoint</h1>
              <p>Your one-stop platform for academic resources</p>
              <Link 
                to="/resources" 
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
              >
                Browse Resources
              </Link>
            </div>
          } />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
