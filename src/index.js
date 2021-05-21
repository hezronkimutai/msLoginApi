require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import router from "./routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

// app.use("/", router);

app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to MS test API.",
  })
);
app.use("*", (req, res) =>
  res.status(404).send({
    message: "Ooops route does not exist!",
  })
);
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}....`);
});

export default app;
