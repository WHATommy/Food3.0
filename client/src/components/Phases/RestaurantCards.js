import React, { useState } from 'react'

const RestaurantCards = (props) => {
    console.log(props)
    return (
        <div className='row g-2 p-3'>
            <div className='col-md-6 col-sm-12'>
                <div className='card h-100'>
                    {props.restaurantList[0].image_url ? <img src={props.restaurantList[0].image_url} className="card-img-top" height={400} alt=""/> : <p className="card-img-top" style={{height: "225px"}}>No image available</p>}
                    <div className="card-body">
                        <h5 className="card-title">{props.restaurantList[0].name}</h5>
                        <p class="card-text">Price: {props.restaurantList[0].price}</p>
                        <p class="card-text">Rating: {props.restaurantList[0].rating}/5</p>
                    </div>
                    <div class="card-body">
                        <a href={props.restaurantList[0].url} class="card-link" target="blank">Link</a>
                        <button class="btn btn-outline-primary card-link float-end" onClick={() => props.callback(0)}>Select</button>
                    </div>
                </div>
            </div>
            <div className='col-md-6  col-sm-12'>
                <div className='card h-100'>
                    {props.restaurantList[1].image_url ? <img src={props.restaurantList[1].image_url} className="card-img-top" height={400} alt=""/> : <p className="card-img-top" style={{height: "225px"}}>No image available</p>}
                    <div className="card-body">
                        <h5 className="card-title">{props.restaurantList[1].name}</h5>
                        <p class="card-text">Price: {props.restaurantList[1].price}</p>
                        <p class="card-text">Rating: {props.restaurantList[1].rating}/5</p>
                    </div>
                    <div class="card-body">
                        <a href={props.restaurantList[1].url} class="card-link" target="blank">Link</a>
                        <button class="btn btn-outline-primary card-link float-end" onClick={() => props.callback(1)}>Select</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCards

