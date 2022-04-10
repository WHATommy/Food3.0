import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import cookie from "js-cookie";
import Spinner from "./Spinner";
import Chance from "chance";
const chance = new Chance();
const UserCards = React.lazy(() => import("./UserCards"));

const CONNECTION_PORT = "localhost:3002/";
let socket;

const Lobby = () => {
    let sessionID = window.location.pathname.split('/')[1];
    let navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [tab, setTab] = useState('location');
    const [query, setQuery] = useState({
        price1: false,
        price2: false,
        price3: false,
        price4: false,
        categories: "",
        location: "",
        latitude: "",
        longitude: "",
    })

    useEffect(() => {
        socket = io(CONNECTION_PORT);
        let username = cookie.get("username");
        if(username === undefined || username === "undefined" || username.length === 0 || username === '') {
            username = chance.name();
            cookie.set("username", username);
        }
        const query = cookie.get('query')
        if(query) cookie.remove('query');

        socket.emit("join", { sessionID, username });

        socket.on("joined", ({userID, users}) => {
            if(!cookie.get("userID")) {
                cookie.set("userID", userID);
            }
            setUsers(users);
        });
        socket.on("disconnected", users => {
            setUsers(users);
        });
    }, []);
    

    const { price1, price2, price3, price4, categories, location, latitude, longitude } = query;
    const [gameMode, setGameMode] = useState('');

    const onChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    const swapTab = (e) => {
        e.preventDefault();
        switch(e.target.id) {
            case 'location-tab':
                document.getElementById(e.target.id).classList.add("active");
                document.getElementById("latlong-tab").classList.remove("active");
                document.getElementById("currentLoc-tab").classList.remove("active");
                setTab('location');
                break;
            case 'latlong-tab':
                document.getElementById(e.target.id).classList.add("active");
                document.getElementById("location-tab").classList.remove("active");
                document.getElementById("currentLoc-tab").classList.remove("active");
                setTab('latlong');
                break;
            case 'currentLoc-tab':
                document.getElementById(e.target.id).classList.add("active");
                document.getElementById("location-tab").classList.remove("active");
                document.getElementById("latlong-tab").classList.remove("active");
                setTab('currentLoc');
                break;
            default:
                break;
        }

        if(e.target.id === "latlong-tab") {
            document.getElementById(e.target.id).classList.add("active");
            document.getElementById("location-tab").classList.remove("active");
            setTab('latlong');
        }
        if(e.target.id === "latlong-tab") {
            document.getElementById(e.target.id).classList.add("active");
            document.getElementById("location-tab").classList.remove("active");
            setTab('latlong');
        }
    }

    const getCurrentPosition = async(callback) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            callback({latitude: pos.coords.latitude, longitude: pos.coords.longitude})
        });
    }

    const startPhase1 = async (e) => {
        e.preventDefault();
        let finalizeQuery = { open_now: true };

        // Price
        let price = [];
        if (price1) price.push('1');
        if (price2) price.push('2');
        if (price3) price.push('3');
        if (price4) price.push('4');
        if (price.length !== 0) finalizeQuery = {...finalizeQuery, price: price.join()};

        // Query setup
        switch(tab) {
            case 'location':
                finalizeQuery = {
                    ...finalizeQuery,
                    categories,
                    location
                }
                cookie.set("query", JSON.stringify(finalizeQuery))
                navigate(`/${sessionID}/phase1`);
                break;
            case 'latlong':
                finalizeQuery = {
                    ...finalizeQuery,
                    categories,
                    latitude,
                    longitude
                }
                cookie.set("query", JSON.stringify(finalizeQuery))
                navigate(`/${sessionID}/phase1`);
                break;
            case 'currentLoc':
                let latitude, longitude
                getCurrentPosition(callback => {
                    finalizeQuery = {
                        ...finalizeQuery,
                        categories,
                        latitude: callback.latitude,
                        longitude: callback.longitude
                    };
                    cookie.set("query", JSON.stringify(finalizeQuery));
                    cookie.set("phase", 1);
                    navigate(`/${sessionID}/phase1`);
                });
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div className='container mt-3'>
                <div className='row w-auto' style={{ margin: "auto" }}>
                    <form className='border border-primary p-4'>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button id="location-tab" className="nav-link active" onClick={swapTab}>Location</button>
                            </li>
                            <li className="nav-item">
                                <button id="latlong-tab" className="nav-link" onClick={swapTab}>Lat & Long</button>
                            </li>
                            <li className="nav-item">
                                <button id="currentLoc-tab" className="nav-link" onClick={swapTab}>Current location</button>
                            </li>
                        </ul>
                        {
                            tab === "location" ? 
                            <div className="mb-3 mt-2">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="locaionInput" 
                                    aria-describedby="location" 
                                    name="location"
                                    value={location}
                                    onChange={onChange}
                                />
                            </div>
                            :
                            tab === "latlong" ?
                            <div className='row'>
                                <div className="mb-3 mt-2 col-md-6 col-sm-12">
                                    <label htmlFor="latitude" className="form-label">Latitude</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="latitudeInput" 
                                        aria-describedby="Latitude"
                                        name="latitude" 
                                        value={latitude}
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="mb-3 mt-2 col-md-6 col-sm-12">
                                    <label htmlFor="longitude" className="form-label">Longitude</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="longitudeInput" 
                                        aria-describedby="Longitude"
                                        name="longitude"  
                                        value={longitude}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            :
                            tab === "currentLoc" ?
                            <></>
                            : 
                            null
                        }
                        <div className='row'>
                            <div className="mb-3 mt-2 col-md-6 col-sm-12">
                                <label htmlFor="categories" className="form-label">Category</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="latitudeInput" 
                                    aria-describedby="Latitude" 
                                    name="categories"  
                                    value={categories}
                                    onChange={onChange}
                                />
                                <div id="categoriesHelp" class="form-text">Separate multiple categories by commas</div>
                            </div>
                            <div className="mb-3 mt-2 col-md-6 col-sm-12">
                                <div className='row'>
                                    <label htmlFor="price" className="form-label">Price Range</label>
                                    <div className='d-flex justify-content-evenly flex-wrap rounded' style={{border: "1px solid #ced4da", minHeight: "47px"}}>
                                        <div className="col-3 p-1" style={{whiteSpace: "nowrap"}}>
                                            <input className="form-check-input" type="checkbox" onClick={() => setQuery({...query, price1: !price1})} id="priceOption1"/>
                                            <label className="form-check-label" for="priceOption1">
                                                $
                                            </label>
                                        </div>
                                        <div className="col-3 p-1" style={{whiteSpace: "nowrap"}}>
                                            <input className="form-check-input" type="checkbox" onClick={() => setQuery({...query, price2: !price2})} id="priceOption2"/>
                                            <label className="form-check-label" for="priceOption2">
                                                $$
                                            </label>
                                        </div>
                                        <div className="col-3 p-1" style={{whiteSpace: "nowrap"}}>
                                            <input className="form-check-input" type="checkbox" onClick={() => setQuery({...query, price3: !price3})} id="priceOption3"/>
                                            <label className="form-check-label" for="priceOption3">
                                                $$$
                                            </label>
                                        </div>
                                        <div className="col-3 p-1" style={{whiteSpace: "nowrap"}}>
                                            <input className="form-check-input" type="checkbox" onClick={() => setQuery({...query, price4: !price4})} id="priceOption4"/>
                                            <label className="form-check-label" for="priceOption4" >
                                                $$$$
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary col-md-4 col-sm-12" onClick={startPhase1}>Start</button>
                        </div>
                    </form>
                </div>
            </div>
            <React.Suspense fallback={Spinner}>
                {users.length !== 0 ? <UserCards users={users} /> : null}
            </React.Suspense>
        </>
    );
};


export default Lobby;