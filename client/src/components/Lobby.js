import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const CONNECTION_PORT = "localhost:3002/";
let socket;

const Lobby = () => {
    const [users, setUsers] = useState([]);
    const [stage, setState] = useState(1);
    const [restaurantList, setRestaurantList] = useState([]);
    const [gameMode, setGameMode] = useState('');

    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, []);

    return (
        <>
            <h1>LOBBY</h1>
        </>
    );
};


export default Lobby;