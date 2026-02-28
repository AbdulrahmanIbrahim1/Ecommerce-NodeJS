const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API Documentation for my project",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
      },
    ],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  apis: ["./routes/*.js"], // بيقرأ الكومنتات من ملفات الراوت
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
