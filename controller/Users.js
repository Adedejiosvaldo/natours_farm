const fs = require("fs");

const UsersData = JSON.parse(fs.readFileSync("./dev-data/data/users.json"));

const getAllUsers = async (req, res) => {
  res.status(200).json({
    status: "success",

    result: UsersData.length,
    data: {
      UsersData,
    },
  });
};

const createUser = async (req, res) => {
  const newId = UsersData[UsersData.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  //Push
  UsersData.push(newTour);

  //Write updated File
  fs.writeFile(
    `./dev-data/data/tours-simple.json`,
    JSON.stringify(UsersData),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newUser,
        },
      });
    }
  );
};

const getAUser = async (req, res) => {
  const { id } = req.params;

  //   console.log(id);
  const user = UsersData.find((el) => el.id === parseInt(id));

  if (!user) {
    return res.status(400).json({
      staus: "Error",
      data: {
        message: "ID does not exist",
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
};

const updateUser = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;
  c;

  const user = UsersData.find((el) => el.id === parseInt(id));

  if (!user) {
    return res.status(400).json({
      staus: "Error",
      data: {
        message: "ID does not exist",
      },
    });
  }
};

const deleteUser = async (req, res) => {};

module.exports = { getAUser, getAllUsers, createUser, updateUser, deleteUser };
