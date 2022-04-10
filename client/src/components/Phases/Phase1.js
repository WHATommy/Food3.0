import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCards from './RestaurantCards';
import CountDownTimer from '../Timer/CountDownTimer';
import useCountDown from "../Timer/useCountDown";
import io from "socket.io-client";
import cookie from "js-cookie";
import Chance from "chance";
const chance = new Chance();

const CONNECTION_PORT = "localhost:3002/";
let socket;

const timeLimit = 10 * 1000;
let currentTime = new Date().getTime();
let targetTime = currentTime + timeLimit;

const Phase1 = () => {
    let sessionID = window.location.pathname.split('/')[1];
    let navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [timer, setTimer] = useState();
    const [vote, setVote] = useState({
        left: 0,
        right: 0
    });


    useEffect(() => {
        socket = io(CONNECTION_PORT);

        let username = cookie.get('username');
        if(!username) {
            username = chance.name();
            cookie.set("username", username);
        }

        let query = cookie.get('query');
        if(query) {
            query = JSON.parse(query);
            socket.emit("yelp", {sessionID, query });
            cookie.remove('query');
        }
        
        let userID = cookie.get('userID'); 
        if(!userID) {
            socket.emit("join", { sessionID, username });
        }

        socket.on("joined", ({userID, users}) => {
            if(!cookie.get("userID")) {
                cookie.set("userID", userID);
            }
            setUsers(users);
        });
        socket.on("disconnected", users => {
            setUsers(users);
        });
        socket.on("getRestaurants", restaurants => {
            setRestaurants(restaurants);
        });
    }, []);

    const removeRestaurantIndex = () => {
        currentTime = new Date().getTime();
        targetTime = currentTime + timeLimit;
        seconds = 10;
    };

    let seconds = useCountDown(targetTime);
    const displayTimer = () => {
        return (
            <div className="show-counter">
                <div>
                    <p>{seconds}</p>
                    <span>Seconds</span>
                </div>
            </div>
        )
    };

    useEffect(() => {
        console.log(seconds, seconds === 1)
        if(seconds === 1) {
            let temp = restaurants;
            if(vote.left < vote.right) {
                temp.splice(0, 1);
            } else {
                temp.splice(1, 2);
            }
            setRestaurants(...temp)
            //setVote({left:0, right:0})
        }
    })

    return (
        <>
            {
                seconds > 0 ?
                displayTimer()
                :
                removeRestaurantIndex()
            }
            {
            restaurants[0] && restaurants[1] ? 
                <div className='container'>
                    <div className='row g-2 p-3'>
                        <div className='col-md-6 col-sm-12'>
                            <div className='card h-100'>
                                {restaurants[0].image_url ? <img src={restaurants[0].image_url} className="card-img-top" height={400} alt=""/> : <p className="card-img-top" style={{height: "225px"}}>No image available</p>}
                                <div className="card-body">
                                    <h5 className="card-title">{restaurants[0].name}</h5>
                                    <p class="card-text">Price: {restaurants[0].price}</p>
                                    <p class="card-text">Rating: {restaurants[0].rating}/5</p>
                                </div>
                                <div class="card-body">
                                    <a href={restaurants[0].url} class="card-link" target="blank">Link</a>
                                    <button class="btn btn-outline-primary card-link float-end" onClick={() => removeRestaurantIndex(0)}>Select</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6  col-sm-12'>
                            <div className='card h-100'>
                                {restaurants[1].image_url ? <img src={restaurants[1].image_url} className="card-img-top" height={400} alt=""/> : <p className="card-img-top" style={{height: "225px"}}>No image available</p>}
                                <div className="card-body">
                                    <h5 className="card-title">{restaurants[1].name}</h5>
                                    <p class="card-text">Price: {restaurants[1].price}</p>
                                    <p class="card-text">Rating: {restaurants[1].rating}/5</p>
                                </div>
                                <div class="card-body">
                                    <a href={restaurants[1].url} class="card-link" target="blank">Link</a>
                                    <button class="btn btn-outline-primary card-link float-end" onClick={() => removeRestaurantIndex(1)}>Select</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            : 
                null 
            }
        </>
    );
};


export default Phase1;