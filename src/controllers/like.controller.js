import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// function for like the videos

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }

  let isLiked = await Like.find({
    video: new mongoose.Types.ObjectId(`${videoId}`),
  });

  isLiked.length === 0 ? (isLiked = false) : (isLiked = true);

  let togglelike;
  if (isLiked) {
    togglelike = await Like.deleteMany({
      video: new mongoose.Types.ObjectId(`${videoId}`),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, togglelike, "you dislike the video"));
  } else {
    togglelike = await Like.create({
      video: new mongoose.Types.ObjectId(`${videoId}`),
      likedBy: req.user?._id,
    });
  }

  // console.log(togglelike);

  return res
    .status(200)
    .json(new ApiResponse(200, togglelike, "you like the video"));
});
// -------------------------------------

// function for like the comments

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!commentId) {
    throw new ApiError(400, "invalid commentId");
  }

  let isLiked = await Like.find({
    comment: new mongoose.Types.ObjectId(`${commentId}`),
  });

  isLiked.length === 0 ? (isLiked = false) : (isLiked = true);

  let togglelike;
  if (isLiked) {
    togglelike = await Like.deleteMany({
      comment: new mongoose.Types.ObjectId(`${commentId}`),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, togglelike, "you dislike the comment"));
  } else {
    togglelike = await Like.create({
      comment: new mongoose.Types.ObjectId(`${commentId}`),
      likedBy: req.user?._id,
    });
  }

  // console.log(togglelike);

  return res
    .status(200)
    .json(new ApiResponse(200, togglelike, "you like the comment"));
});
// --------------------------------

// function for like the comments

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!tweetId) {
    throw new ApiError(400, "invalid tweetId");
  }

  let isLiked = await Like.find({
    tweet: new mongoose.Types.ObjectId(`${tweetId}`),
  });

  isLiked.length === 0 ? (isLiked = false) : (isLiked = true);

  let togglelike;
  if (isLiked) {
    togglelike = await Like.deleteMany({
      tweet: new mongoose.Types.ObjectId(`${tweetId}`),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, togglelike, "you dislike the comment"));
  } else {
    togglelike = await Like.create({
      tweet: new mongoose.Types.ObjectId(`${tweetId}`),
      likedBy: req.user?._id,
    });
  }

  // console.log(togglelike);

  return res
    .status(200)
    .json(new ApiResponse(200, togglelike, "you like the comment"));
});

// --------------------------------------

// get liked videos

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const userId = req.user?._id;
  try {
    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError(404, "please login first");
    }

    const likedVideo = await Like.find({
      likedBy: new mongoose.Types.ObjectId(`${userId}`),
    }).select("-comment -tweet");

    if (!likedVideo || likedVideo.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, likedVideo, "no video liked yet"));
    }

    console.log(likedVideo);

    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideo, "fetched liked video successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for liked video"
    );
  }
});

// ---------------------------------

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
