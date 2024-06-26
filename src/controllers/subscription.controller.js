import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// controller for subscribing channel
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  try {
    if (!channelId || !isValidObjectId(channelId)) {
      throw new ApiError(400, "invalid channelId");
    }

    let isSubscribed = await Subscription.find({
      subscriber: req.user?._id,
      channel: new mongoose.Types.ObjectId(`${channelId}`),
    });

    isSubscribed.length === 0 ? (isSubscribed = false) : (isSubscribed = true);

    let toggleSubscribe;
    if (isSubscribed) {
      toggleSubscribe = await Subscription.deleteMany({
        subscriber: req.user?._id,
        channel: new mongoose.Types.ObjectId(`${channelId}`),
      });
      return res
        .status(200)
        .json(
          new ApiResponse(200, toggleSubscribe, "you unsubscirbed the channel")
        );
    } else {
      toggleSubscribe = await Subscription.create({
        subscriber: req.user?._id,
        channel: new mongoose.Types.ObjectId(`${channelId}`),
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, toggleSubscribe, "channel subscribed successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while subscribing a channel"
    );
  }
});
// ----------------------------------------

// controller to return subscriber list of a channel
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channelId");
  }

  try {
    const subscribersList = await Subscription.find({
      channel: new mongoose.Types.ObjectId(`${channelId}`),
    });

    if (subscribersList.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            subscribersList,
            "channel is not subscribed by anyone"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribersList,
          "subscribers fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for subscribers of channel"
    );
  }
});
// -----------------------------------------------------

// controller to return channel list to which user has subscribed
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "invalid channelId");
  }
  try {
    const channelList = await Subscription.find({
      subscriber: new mongoose.Types.ObjectId(`${subscriberId}`),
    });

    if (channelList.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            channelList,
            "subscriber is not subscribed any channel"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelList,
          "subscribed channel fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "failed while looking for subscribers of channel"
    );
  }
});
// ---------------------------------------------------------------

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
