const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); //middleware for logging HTTP requests use before routes

dotenv.config({ path: "config.env" });
console.log("procces is : ", process.env.NODE_ENV);

const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
// const authMiddleware = require("./middleware/jwtMiddleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// connect to database
dbConnection();

const app = express();

app.use(express.json()); //middleware to parse json request body
// app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
// app.use('/api/v1/categories', authMiddleware , categoryRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subCategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  console.log("Incoming URL not matched:", req.originalUrl);
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// event listener for unhandled promise rejections ( event => list => callback(err))
// handle errors that we can't predict(outside express)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down....");
    process.exit(1);
  });
});
// كده ش محتاج اعمل catch لكل promise في الكود بتاعي
