const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const chapterModel = mongoose.model("chapter");