import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Navigation extends Component {
    render() {
        return (
            <div className="navigation">
                <ul>
                    <NavLink to="/">
                        <li>accueil</li>
                    </NavLink>
                    <NavLink to="/profile">
                        <li>profile</li>
                    </NavLink>
                </ul>
            </div>
        )
    }
}