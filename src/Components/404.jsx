import React, {Component} from 'react';
import PageNotFound from '../Images/readingtunic.jpg'
import {NavLink} from "react-router-dom";
class PageNotFoundError extends Component
{
    render()
    {
        return (
            <div>
                <img alt="404 tunic" src={PageNotFound}/>
                <h1>404 Page Not Found!</h1>
                <h2>Looks like you went adventuring a little too far.</h2>
                <NavLink to="/">
                    Go Home
                </NavLink>
            </div>
        );
    }
}

export default PageNotFoundError;