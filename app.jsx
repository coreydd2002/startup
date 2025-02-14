import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { About } from './about/about';

export default function App() {
    return (
        <BrowserRouter>
        <div className="body bg-dark text-light">
            <header className="container-fluid">
                <nav className="navbar fixed-top navbar-dark">
                    <div className="navbar-brand">
                        PenPal<sup>&reg;</sup>
                    </div>
                    <menu className="navbar-nav">
                        <li className="nav-item ms-auto">
                        <NavLink className="nav-link" to="/">
                            -Login-
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink className="nav-link" to="play">
                            -Pals-
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        </li>
                        <li className="nav-item">
                        <NavLink className="nav-link" to="about">
                            -About-
                        </NavLink>
                        </li>
                    </menu>
                </nav>
            </header>
    
            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/play' element={<Play />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
    
            <footer class="bg-dark text-white-50">
                <div class="container-fluid">
                <span class="me">Corey Dickson</span>
                <a class="myGithub" href="https://github.com/coreydd2002/startup">GitHub</a>
                </div>
            </footer>
        </div>
      </BrowserRouter>
    );
  }

  function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }