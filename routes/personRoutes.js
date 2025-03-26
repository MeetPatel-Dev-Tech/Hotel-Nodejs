const express = require("express");
const router = express.Router();
const person = require("../models/person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //assuming the body contains person data
    const newPerson = new person(data);
    const response = await newPerson.save();
    const payload = {
      id: response.id,
      username: response.username,
    };
    const token = generateToken(payload);
    console.log("response saved");
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// login route

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await person.findOne({ username: username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await person.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const persons = await person.find();
    res.status(200).json(persons);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (
      workType === "chef" ||
      workType === "waiter" ||
      workType === "manager"
    ) {
      const response = await person.find({ work: workType });
      res.status(200).json(response);
    } else {
      return res.status(404).json({ error: "Invalid Work Type" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const updatePersonData = req.body;

    const response = await person.findByIdAndUpdate(
      personId,
      updatePersonData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatePersonData) {
      return res.status(404).json({ error: "Person Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const response = await person.findByIdAndDelete(personId);

    if (!response) {
      return res.status(404).json({ error: "Person Not Found" });
    }
    res.status(200).json({ message: "Person Deleted Succesfully" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
