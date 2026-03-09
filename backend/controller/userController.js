import User from "../model/user.js";
import bcrypt from "bcrypt";
import { generateToken, setCookies } from "../middleware/authentication.js"; // Adjust this path to where your generateToken/setCookies are located


// Create a new user profile
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, address, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !address ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      password,
    });

    // save user to the database
    const saveUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User profile created successfully", user: saveUser });
  } catch (error) {
    console.error("Error saving user profile", error.message);
    res
      .status(500)
      .json({ message: "error in saving user profile", error: error.message });
  }
};


// fetch all user profiles from the database
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // ✅ changed userModel to User
    res
      .status(200)
      .json({ message: "User profile successfully fetched", users });
  } catch (error) {
    res.status(500).json({
      message: "error in fetching user profile",
      error: error.message,
    });
  }
};

// fetch a single user profile by id
const getOneUser = async (req, res) => {
  try {
    const userOne = req.params._id;
    const oneUser = await User.findById(userOne); // ✅ changed userModel to User
    if (!oneUser) {
      return res
        .status(404)
        .json({ success: false, message: "user profile not found", oneUser });
    }
    res.status(200).json({
      success: true,
      message: "user profile fetched successfully",
      oneUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in the server", error: error.message });
  }
};


// login user and generate token for authentication

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordCorrect = await findUser.matchPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // --- THE FIX STARTS HERE ---
    // 1. Generate the Access and Refresh tokens using the user's ID
    const { AccessToken, RefreshToken } = generateToken(findUser._id);

    // 2. Attach these tokens to the response as Cookies
    setCookies(res, AccessToken, RefreshToken);
    // --- THE FIX ENDS HERE ---

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
        phoneNumber: findUser.phoneNumber,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};



// delete user profile by id 
const deleteUser = async (req, res) => {
  try {
    const userId = req.params._id;
    const deletedUser = await User.findByIdAndDelete(userId); 
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User profile not found" });
    }
    return res.status(204).json({
      success: true,
      message: "User profile deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error coming from server",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params._id;
    const updates = req.body;
    const userUpdated = await User.findByIdAndUpdate(userId, updates, {
      // ✅ changed userModel to User
      new: true,
      runValidators: true,
    });
    if (!userUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "User profile could not be updated" });
    }
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: userUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error coming from server",
      error: error.message,
    });
  }
};

export {
  createUser,
  getAllUsers,
  getOneUser,
  loginUser,
  deleteUser,
  updateUser,
};
