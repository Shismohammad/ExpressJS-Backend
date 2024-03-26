import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validationBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while  generating access or refresh token "
        );
    }
};
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //   message: "Ok",
    // });

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, fullName, password } = req.body;

    // if (username === "") {
    //   throw new ApiError(400,"Username is Required");
    // }

    if (
        [username, email, fullName, password].some((field) => {
            field?.trim() === "";
        })
    ) {
        throw new ApiError(400, "All field are Required");
    }

    const existedUser = await User.findOne({ email: email });

    // console.log("Existed User : \n", existedUser);

    if (existedUser != null) {
        throw new ApiError(409, "User already exists");
    }

    // console.log("Files : \n", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        fullName,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User Registration successful")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email,
    });

    if (!user) {
        throw new ApiError(404, "User Not Found !");
    }

    const isPaswordVaild = await user.isPasswordCorrect(password);

    if (!isPaswordVaild) {
        throw new ApiError(401, "Wrong Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
                "User LoggedIn Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options);
});

export { registerUser, loginUser, logoutUser };
