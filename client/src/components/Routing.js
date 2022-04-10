import React from 'react';
import { BrowserRouter as Route, Routes } from 'react-router-dom';

import Home from './Home';
import Lobby from './Lobby';

const Routing = () => {
    return (
        <section>
            <Route exact path='/' component={Home}/>
            <Route exact path='/lobby' component={Lobby}/>
        </section>
    );
};

export default Routing