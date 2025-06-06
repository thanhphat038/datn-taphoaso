import { userService } from '../services/index.js';
import bcrypt from 'bcrypt';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if user exists
    const existingUser = await userService.findAll({ $or: [{ email }, { username }] });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userService.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await userService.findAll({}, { select: '-password' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await userService.findById(req.params.id, { select: '-password' });
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    let updateFields = updateData;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields = { ...updateData, password: hashedPassword };
    }

    const user = await userService.update(req.params.id, updateFields);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
