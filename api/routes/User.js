const { Router, Router } = require("express");
const Profile = require('../models/Subject');
const { Op } = require('sequelize');
const checkAuth = require('../middlewares/checkAuth');

const router = new Router();

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    }
    )
};

const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { firstName, lastname, bio, email, password, isAdmin, active, recent_token } = request.body

    pool.query(
        'UPDATE users SET firstname = $1, lastname = $2, bio = $3, email = $4, password = $5, isAdmin = $6, active = $7, recent_token = $8 WHERE id = $9',
        [firstname, lastname, bio, email, password, isAdmin, active, recent_token, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}