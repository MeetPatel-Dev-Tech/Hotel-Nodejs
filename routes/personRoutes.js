const express = require("express");
const router = express.Router();
const person = require("../models/person");

router.post("/", async (req, res) => {
  try {
    const data = req.body; //assuming the body contains person data
    const newPerson = new person(data);
    const response = await newPerson.save();
    console.log("response saved");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
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
