import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { About } from './about/about';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
    <div className="body bg-dark text-light">
        <header className="container-fluid">
            <nav className="navbar fixed-top navbar-dark">
                <div className="navbar-brand">
                    PenPal<sup>&reg;</sup>
                </div>
                <div className="spacer"></div>
                <menu className="navbar-nav">
                  {authState === AuthState.Unauthenticated && (<>
                    <li className="nav-item ms-auto">
                      <div></div>
                      <li className="nav-item ms-auto">
                        <NavLink className="nav-link" to="/">-Login-</NavLink>
                      </li>
                    </li>
                  </>)}  
                  {authState === AuthState.Authenticated && (<>
                    <li className="nav-item ms-auto">
                      <NavLink className="nav-link" to="play">-Chat-</NavLink>
                    </li>
                    <li className="nav-item ms-auto">
                      <NavLink className="nav-link" to="/">-Logout-</NavLink>
                    </li>
                  </>)}  
                    <li className="nav-item ms-auto">
                    <NavLink className="nav-link" to="about">
                        -About-
                    </NavLink>
                    </li>
                </menu>
            </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/play' element={<Play userName={userName} />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="me">Corey Dickson</span>
            <a className="myGithub" href="https://github.com/coreydd2002/startup">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
