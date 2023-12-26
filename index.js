require("dotenv").config();
const { parse } = require("dotenv");
const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const logging = require("./middleware/custom_middleware");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static("public"));
// app.use(logging);/
app.use(morgan("tiny"));

const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
];

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.get("/api/course/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  res.send(course);
});

app.post("/api/course", (req, res) => {
  const new_course = {
    id: courses[courses.length - 1]?.id + 1 || 1,
    name: req.body.name,
  };
  let result = validateInput(new_course);
  if (result.error) {
    res.status(400).json({ message: result.error.details[0].message });
  } else {
    courses.push(new_course);
    res.send(courses);
  }
});

app.put("/api/course/:id", (req, res) => {
  let course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(400).json({ message: "Course is not available" });
  } else {
    let { error } = validateInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      course.name = req.body.name;
      res.status(200).send(course);
    }
  }
});

app.delete("/api/course/:id", (req, res) => {
  let course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(400).json({ message: "Course is not available" });
  } else {
    let index = courses.indexOf(course);
    courses.splice(index, 1);
    res.status(200).send(courses);
  }
});

function validateInput(course) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    // id: Joi.number().required(),
  });
  return schema.validate(course);
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
