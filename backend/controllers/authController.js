import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Register User
export const register = async (req, res) => {
  const { username, email, password, role } = req.body; // Add role to the request body
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user with role
    user = new User({ username, email, password, role });
    await user.save();

    // Generate JWT token
    const payload = { userId: user.id, role: user.role }; // Include role in the token payload
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // ✅ Include role in the JWT payload
    const payload = { 
      userId: user.id, 
      role: user.role // Now the token will include the role
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Logout User
export const logout = (req, res) => {
  // You can clear the token from the cookies or frontend storage (client-side)
  // If using cookies, here's an example of clearing the token:
  res.clearCookie('token');  // Clear the JWT token cookie, if used
  res.json({ msg: 'Logged out successfully' });
};

