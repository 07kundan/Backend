import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extracting token from cookies or Authorization header
    // console.log("Request Cookies:", req.cookies)
    // console.log("Request Headers:", req.headers);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log("token", token);

    if (!token || typeof token !== "string" || token.trim() === "") {
      // console.log("No token provided or token is not a string"); // Debugging line
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      // console.log("Token verification failed"); // Debugging line
      throw new ApiError(401, "Invalid Access Token");
    }

    // console.log("decodedToken", decodedToken)
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // console.log("User not found"); // Debugging line

      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyJWT middleware:", error.message); // Debugging line
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
