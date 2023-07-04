import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios"

import UserModel from "../models/userModel.js";

const secret = 'test';



export const signup = async (req, res) => {
    if (req.body.googleAccessToken) {
      const { googleAccessToken } = req.body;
        try {
            const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { "Authorization": `Bearer ${googleAccessToken}` }
            });
            const {  given_name : firstName, family_name : lastName, email, picture } = response.data;
            const existingUser = await UserModel.findOne({ email })
            if (existingUser) return res.status(400).json({ message: "User already exist!" })         
            const result = await UserModel.create({  email, name: `${firstName} ${lastName}`, profilePicture: picture })
            
            const token = jwt.sign({ email: result.email, id: result._id }, secret);
            res.status(201).json({ result, token });

        } catch (error) {
            res.status(400).json({ message: "Invalid access token!" })
        }
    } else {
        const { email, password, firstName, lastName, profilePicture } = req.body;
        try {
            const oldUser = await UserModel.findOne({ email });

            if (oldUser) return res.status(400).json({ message: "User already exists" });

            const hashedPassword = await bcrypt.hash(password, 12);

            const result = await UserModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, profilePicture });
            const token = jwt.sign({ email: result.email, id: result._id }, secret);
            res.status(201).json({ result, token });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
        }
    }
}

export const signin = async (req, res) => {
  if (req.body.googleAccessToken) {
    // google auth
    const { googleAccessToken } = req.body;
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          "Authorization": `Bearer ${googleAccessToken}`
        }
      })
      const {  given_name : firstName, family_name : lastName, email, picture } = response.data;
      const existingUser = await UserModel.findOne({ email })
      if (!existingUser) return res.status(404).json({ message: "User don't exist!" })
      const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret)
      res.status(200).json({ result: existingUser, token })
    } catch (error) {
      res.status(400).json({ message: "Invalid access token!" })
    }
  } else {
    //normal auth
    const { email, password } = req.body;
    try {
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
      const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret);
      res.status(200).json({ result: existingUser, token });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

