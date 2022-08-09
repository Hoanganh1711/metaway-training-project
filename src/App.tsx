import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div style={{ width: '70%', margin: "140px auto 0 auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
