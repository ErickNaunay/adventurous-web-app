const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const storyModel = mongoose.model("story");
const chapterModel = mongoose.model("chapter");

const find = async (req, res) => {
  let stories;

  try {
    stories = await storyModel.find().select("-chapters").exec();
  } catch (err) {
    throw createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Stories not found"
    );
  }

  const result = stories || stories.length || [];

  res.status(StatusCodes.OK).json({ data: result });
};

const findOne = async (req, res) => {
  const id = req.params.id;

  const errorMsg = `Could not find story with id = '${id}'`;

  if (!isValidObjectId(id)) {
    throw new createHttpError.NotFound(errorMsg);
  }

  const story = await storyModel.findById(id).populate("chapters", "-story").exec();

  if (!story) {
    throw new createHttpError.NotFound(errorMsg);
  }

  res.status(StatusCodes.OK).json({ data: story });
};

const create = async (req, res) => {
  let story;

  try {
    story = await storyModel.create({
      title: req.body.title,
      summary: req.body.summary,
    });
  } catch (err) {
    throw createHttpError(
      httpStatusCodes.BAD_REQUEST,
      "Story could not be created",
      {
        errors: [
          {
            property: "title",
            constraints: ["has already been taken"],
          },
        ],
      }
    );
  }

  const id = story.id;

  const errorMsg = `Could not find story with id = '${id}'`;

  if (!isValidObjectId(id)) {
    throw new createHttpError.NotFound(errorMsg);
  }

  const result = await storyModel.findById(id).select("-chapters").exec();

  if (!result) {
    throw new createHttpError.NotFound(errorMsg);
  }

  res.status(StatusCodes.CREATED).json({ data: result });
};

const update = async (req, res) => {
  const id = req.params.id;

  const errorMsg = `Could not find story with id = '${id}'`;

  if (!isValidObjectId(id)) {
    throw new createHttpError.NotFound(errorMsg);
  }

  const story = await storyModel.findById(id).select("-chapters").exec();

  if (!story) {
    throw new createHttpError.NotFound(errorMsg);
  }

  story.title = req.body.title || story.title;
  story.summary = req.body.summary || story.summary;

  let updateStory;

  try {
    updateStory = await story.save();
  } catch (err) {
    throw createHttpError(
      httpStatusCodes.BAD_REQUEST,
      "Story could not be created",
      {
        errors: [
          {
            property: "title",
            constraints: ["has already been taken"],
          },
        ],
      }
    );
  }

  res.status(StatusCodes.OK).json({ data: updateStory });
};

const remove = async (req, res) => {
  const id = req.params.id;
  const errorMsg = `Could not find nor delete story with id = '${id}'`;

  if (!isValidObjectId(id)) {
    throw new createHttpError.NotFound(errorMsg);
  }

  const story = await storyModel.findByIdAndDelete(id).exec();

  if (!story) {
    throw new createHttpError.NotFound(errorMsg);
  }

  res.status(StatusCodes.NO_CONTENT).json();
};

module.exports = {
  find,
  findOne,
  create,
  update,
  remove,
};
