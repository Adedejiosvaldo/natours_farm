const fs = require("fs");

const UsersData = JSON.parse(fs.readFileSync("../dev-data/data/users.json"));

const getAllUsers = async (req, res) => {};

const createUser = async (req, res) => {};

const getAUser = async (req, res) => {};

const updateUser = async (req, res) => {};

const deleteUser = async (req, res) => {};

module.exports = { getAUser, getAllUsers, createUser, updateUser, deleteUser };
