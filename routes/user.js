import express from "express"
import {signup, signin, googleSignUp } from '../controller/user.js'
const router = express.Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/googleSignUp', googleSignUp)



export default router