const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document found with this id: ${id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: "document deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document found with this id: ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      success: true,
      document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      success: true,
      message: "Document created successfully",
      document,
    });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document found with this id: ${id}`, 404));
    }
    res.status(200).json({
      success: true,
      document,
    });
  });

exports.getAll = (Model, populateOptions, search = "") =>
  asyncHandler(async (req, res) => {
    filtter = {};
    if (req.filterObject) {
      filtter = req.filterObject;
    }
    // bulid mongoose query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filtter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(search)
      .sort()
      .limitFields()
      .populate(populateOptions);

    const { mongooseQuery, paginationResult } = apiFeatures;

    // execute query
    const documents = await apiFeatures.mongooseQuery;
    res.status(200).json({
      success: true,
      result: documents.length,
      // page,
      pagination: paginationResult,
      documents,
    });
  });
