import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  console.log(req.user);

  if (!(name && description)) {
    throw new ApiError(400, "please enter name and description");
  }

  const playlist = await Playlist.create({
    name,
    description,
  });

  const createdPlaylist = await Playlist.findById(playlist._id);

  if (!createPlaylist) {
    throw new ApiError(500, "something went wrong while creating playlist");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdPlaylist, "playlist created successfully")
    );
});

// get User Playlists

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

// --------------------

// get playlistById

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

// ------------------------

// add video to playlist

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

// ---------------------

// removeVideoFromPlaylist

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

// -------------------------

// delete playlist

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

// ----------------

// updatePlaylist

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

// ---------------

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
