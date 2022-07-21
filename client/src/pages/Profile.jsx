import React, { Component, useEffect } from 'react';
import Navigation from '../components/Navigation';
import axios from "axios";


export default class Profile extends Component {

    render() {
        useEffect(() => {
            axios
                .get("")
                .then((res) => console.log(res.data));
        });
        return (
            <div>
                <Navigation />
                <h1>Profile</h1>
            </div>
        )
    }
}
