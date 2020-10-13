import path from "path";

// Swagger definition
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "MS Login Test API",
      version: "1.0.0",
      description: "Microsoft scaffold API",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      contact: {
        name: "The Jitu",
        url: "https://hezron.netlify.app/",
        email: "hezronchelimo.hc@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "token",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3001/api",
      },
      {
        url: "https://ms-login-api.herokuapp.com/api",
      },
    ],
  },
  apis: [path.resolve(__dirname, "../routes/swaggerDocs/index.js")],
};
export default options;
