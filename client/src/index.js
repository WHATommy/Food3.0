import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Lobby from './components/Lobby';
import Phase1 from './components/Phases/Phase1'
import 'bootstrap/dist/css/bootstrap.min.css';

render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <App /> } />
        <Route path="/:sessionID" element={ <Lobby /> } />
        <Route path="/:sessionID/phase1" element={ <Phase1 /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
