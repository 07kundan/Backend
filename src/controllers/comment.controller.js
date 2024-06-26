import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "video don't exist or invalid videoId");
  }

  try {
    const allComments = await Comment.find({
      video: new mongoose.Types.ObjectId(`${videoId}`),
    });

    if (allComments.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, allComments, "comment is empty"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, allComments, "comments fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for comments"
    );
  }
});

// function for adding comment

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video Id");
  }
  if (!content || !content?.trim()) {
    throw new ApiError(400, "comment can't be empty");
  }

  try {
    const addedcomment = await Comment.create({
      content,
      video: new mongoose.Types.ObjectId(`${videoId}`),
      owner: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, addedcomment, "comment added successfully"));
  } catch (error) {
    throw new ApiError(500, "failed while looking adding comment on database");
  }
});

// --------------------------------

// function for updating comment

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const { updatedContent } = req.body;

  // console.log(updatedContent);

  if (!updatedContent || !updatedContent?.trim()) {
    throw new ApiError(400, "updated content can't be empty");
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content: updatedContent,
        },
      },
      {
        new: true, // If new is true it'll return updated video document
      }
    );
    if (!updatedComment) {
      throw new ApiError(500, "failed to updated document");
    }
    // console.log(deletedComment);
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "updating comment succefully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking in database for updating"
    );
  }
});
// ------------------------------

// function for deleting comment

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deleteComment) {
      throw new ApiError(500, "didn't find document");
    }
    // console.log(deletedComment);
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "comment deleted successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking in database for deleting"
    );
  }
});

//--------------------------------

export { getVideoComments, addComment, updateComment, deleteComment };
