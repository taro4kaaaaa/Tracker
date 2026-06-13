const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const goalsPath = path.join(__dirname, "../data/goals.json");
const competitionsPath = path.join(
  __dirname,
  "../data/competitions.json"
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Workout Tracker API",
  });
});

app.get("/goals", async (req, res) => {
  const goals = await fs.readJson(goalsPath);
  res.json(goals);
});

app.get("/competitions", async (req, res) => {
  const competitions = await fs.readJson(competitionsPath);
  res.json(competitions);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});