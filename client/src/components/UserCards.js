import React, { useState, useEffect } from 'react';

const UserCards = (data) => {
    console.log(data)
    return (
        <div className='row mt-3'>
            <div className='d-flex justify-content-evenly flex-wrap'>
            {
                data.users.map(user => (
                    <div className='card text-center p-2 m-1'>
                        <div class="card-body">
                            <h5 class="card-title">{user.username}</h5>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default UserCards;