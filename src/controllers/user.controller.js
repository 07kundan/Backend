import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js ';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/apiResponse.js"


// generating access and refresh token
const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }

}
// -----------------------------------





// register controller
const registerUser = asyncHandler(async (req, res) => {
    // get users details from frontend
    // validation - non empty
    // check if user already exist : username , email
    // check for images, check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, fullname, password } = req.body
    // console.log("email", email)

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are requireed")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // console.log(existedUser)

    if (existedUser) {
        throw new ApiError(409, "user with email or username already exist")
    }

    // console.log(req.files)



    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "avatar is required")
    // }

    // if (!avatar) {
    //     throw new ApiError(400, "avatar is required")

    // }

    let coverImageLocalPath
    let avatarLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)



    const user = await User.create({
        fullname,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

})
// ---------------------


// login controller
const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body()

    // if both are missing throw error
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]      // checking in database if email or username is exist or not
    })

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const isPassword = await user.isPasswordCorrect(password)

    if (!isPassword) {
        throw new ApiError(404, "Invalid user credentials")
    }

    const loggedInUser = await generateAccessAndRefreshToken(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, refreshToken, accessToken
                },
                "user successfully loggedIn"
            )
        )
})
// ----------------


// logout user
const logoutUser = asyncHandler(async () => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "user logged out"))

})

// -----------

export { registerUser, loginUser, logoutUser }