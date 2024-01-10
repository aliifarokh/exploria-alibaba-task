// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTable from './components/UserTable';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<UserTable />} />
        </Routes>
      </Router>
  );
};

export default App;
