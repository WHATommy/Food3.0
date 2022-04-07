import './App.css';
import 'bootstrap';
import '@popperjs/core';

import { useNavigate } from 'react-router-dom';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'js-cookie';

const App = () => {
  let navigate = useNavigate();
  const [username, setUsername] = ('');
  const onChange = (e) => {
      setUsername({ [e.target.name]: e.target.value });
  }
  const createSession = () => {
    const sessionID = uuidv4();
    cookie.set('sessionID', sessionID);
    navigate(`/${sessionID}`);
  }
  return (
    <div className='container' style={{height: "600px"}}>
      <div className='row'>
        <div className='justify-content-center col-12' style={{marginTop: "20%"}}>
          <form className='border border-primary p-5'>
              <div className="mb-3">
                  <input 
                      name="username"
                      type="username" 
                      className="form-control" 
                      id="loginUsername" 
                      value={username}
                      onChange={onChange}
                      placeholder="Type your username..."
                      required
                  />
              </div>
              <div className="text-center" style={customModalFooter}>
                  <button type="button" className="btn btn-primary" onClick={createSession}>Create a session</button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// inline styling
const customModalFooter = {
  borderTop: "1px solid #dee2e6",
  padding: "17px",
}

export default App;
