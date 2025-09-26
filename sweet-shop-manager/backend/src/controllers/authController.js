const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create and save the user. The password will be auto-hashed by the model's pre-save hook.
    user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password were sent
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


