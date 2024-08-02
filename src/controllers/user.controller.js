// import User from '../models/user.model.js';
import { asyncHandler } from "../utils/async-handler.js"

export const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Register user"
    })
})