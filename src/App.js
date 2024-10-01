import React from 'react';
import './App.css'
import FileListComponent from './components/FileComponent/FileListComponent';
import HeaderAppBar from './components/AppBar/HeaderAppBar';
import ProjectDatasetSelection from './components/ProjectDatasetComponent/ProjectDatasetSelection';

function App() {
  return (
    <div className="App">
      <HeaderAppBar/>
      <ProjectDatasetSelection />
      <FileListComponent />
    </div>
  );
}

export default App;
