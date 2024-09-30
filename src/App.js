import React from 'react';
import './App.css'
import FileListComponent from './components/FileComponent/FileListComponent';
import HeaderAppBar from './components/AppBar/HeaderAppBar';

function App() {
  return (
    <div className="App">
      <HeaderAppBar/>
      <FileListComponent />
    </div>
  );
}

export default App;
