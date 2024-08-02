// import User from '../models/user.model.js';
import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // fetch data from frontend
    const {fullname, email, username, password } = req.body;
    // validation of user data -> not empty
    /*
    if(!fullname) {
        throw new ApiError(400, "Fullname is required")
    }
    */
    if(
        [fullname, email, username, password].some((field) => 
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // check if user already exists : username, email
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if(existedUser) {
        throw new ApiError(409, "User already exists")
    }
    // check for images, avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log("coverImageLocalPath", coverImageLocalPath);
    


    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    // upload images to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(500, "Avatar upload failed")
    }
    
    // create user object - create entry in db
    const user = await User.create({
        fullname,
        email,
        username : username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // if cover image is not uploaded
    })
    // remove password, refershToken from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check for user creation
    if(!createdUser) {
        throw new ApiError(500, "User creation failed")
    }
    // send response
    return res.status(201).json(new ApiResponse(
        201, createdUser, "User registered successfully")
    )
})


export { registerUser }

