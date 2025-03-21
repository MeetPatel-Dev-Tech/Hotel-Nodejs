const express = require("express");
const router = express.Router();
const menu = require("../models/menu");

router.post("/", async (req, res) => {
  try {
    const data = req.body; //assuming the body contains person data
    const newMenu = new menu(data);
    const response = await newMenu.save();
    console.log("newMenu response saved");
    res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const menus = await menu.find();
    res.status(200).json(menus);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:tasteType", async (req, res) => {
  try {
    const tasteType = req.params.tasteType;
    if (
      tasteType === "sweet" ||
      tasteType === "spicy" ||
      tasteType === "sour"
    ) {
      const response = await menu.find({ taste: tasteType });
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid Taste Type" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const updateMenu = req.body;
    const response = await menu.findByIdAndUpdate(menuId, updateMenu, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({ error: "Invalid Menu Id" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const response = await menu.findByIdAndDelete(menuId);

    if (!response) {
      return res.status(404).json({ error: "Menu Not Found" });
    }
    res.status(200).json({ message: "Menu Deleted Succesfully" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
