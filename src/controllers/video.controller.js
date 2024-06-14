import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// get all videos

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  // console.log(title);

  try {
    // console.log(allvideos);

    // ++++++ If there is no query it'll return all videos

    if (!query) {
      const allvideos = await Video.find();

      if (!allvideos || allvideos.length === 0) {
        throw new ApiError(202, "no video uploaded yet");
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, allvideos, "all videos fetched successfully")
        );
    }

    // -----------------------------------------------------

    // setting parameters for sorting
    let sortFor = {};

    if (sortBy) {
      sortFor[sortBy] = -1;

      if (sortType) {
        sortFor[sortBy] = sortType === "asce" ? 1 : -1;
      }
    }

    // console.log("sorting", sortFor);

    // -----------------------------

    // fetching data from database according to provided query

    const queriedVideo = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).sort(sortFor);

    // console.log(queriedVideo);

    // ------------------------------------------------------

    if (queriedVideo.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "no videos found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, queriedVideo, "you are seeing queried video"));

    //
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for videos"
    );
  }
});

//------------------

// publish Video

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, views } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title) {
    throw new ApiError(400, "title required");
  }

  if (!description) {
    throw new ApiError(400, "description required");
  }

  let videoLocalPath = req.files?.videoFile[0]?.path;
  let thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "please upload a video");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "please upload a thumbnail");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "video uploading failed");
  }
  if (!thumbnail) {
    throw new ApiError(500, "thumbnail uploading failed");
  }

  // console.log("videoFile", videoFile);

  const videoCreated = await Video.create({
    title,
    description: description || "",
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    duration: videoFile.duration,
    views: views ? parseInt(views) : 0,
    owner: req.user?._id,
  });

  console.log(videoCreated);

  return res
    .status(200)
    .json(new ApiResponse(200, videoCreated, "video uploaded successfully"));
});

// -----------------------

// get videoById

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

// -----------------

// updateVideo

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

// -------------------

// deleteVideo

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

// ---------------

// togglePublishStatus

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

//-------------------

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
