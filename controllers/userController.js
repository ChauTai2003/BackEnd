import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
      const {email,password} = req.body;
      try {
        const user = await userModel.findOne({email});

        if (!user) {
          return res.json({success:false,message:"User does ot exist!"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
          return res.json({success:false,message:"Invalid credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

      } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
      }
};

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    if (!password) {
      return res.json({ success: false, message: "Password is required" });
    }

    // checking if user already existed
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validations
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a stronger password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
