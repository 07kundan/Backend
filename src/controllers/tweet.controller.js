import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create tweet

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "Login to tweet");
  }

  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "content should not be empty");
  }

  const tweetCreated = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweetCreated, "tweet created successfully"));
});
// -----------------------------

// getUserTweet

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  try {
    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError(404, "please provide a valid userId");
    }

    const alltweet = await Tweet.find({
      owner: new mongoose.Types.ObjectId(`${userId}`),
    });
    console.log(alltweet);

    if (alltweet.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, alltweet, "make a first tweet"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, alltweet, "tweets fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for tweets"
    );
  }
});
//----------------------------------

// updateTweet

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params;

  try {
    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError(400, "invalid tweetId");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content: "this is updated tweet of first tweet",
        },
      },
      {
        new: true, // If new is true it'll return updated video document
      }
    );

    if (!updateTweet) {
      throw new ApiError(500, "problem while updating");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for tweets to delete"
    );
  }
});

// -------------------------------------

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  try {
    if (!tweetId || !isValidObjectId(tweetId)) {
      throw new ApiError(400, "invalid tweetId");
    }

    const tweetDeleted = await Tweet.findByIdAndDelete(tweetId);
    // console.log(tweetTodelete); // returns deleted document

    return res
      .status(200)
      .json(new ApiResponse(200, tweetDeleted, "tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for tweets to delete"
    );
  }
});

// -------------------------------------

export { createTweet, getUserTweets, updateTweet, deleteTweet };
