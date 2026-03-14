const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// GET /api/download/:productId
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Map productId to actual file name
    const fileMap = {
      "6712abcf123456789": "Boundaries-Balance.pdf",
      "6712abcf987654321": "Discovery-Challenge.pdf",
      "6712abcfa1234": "Reclaim-Your-Power.pdf",
      "6712abcfb9876": "Self-Awareness.pdf",
    };

    const fileName = fileMap[productId];
    if (!fileName) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "../uploads/pdfs", fileName);

    if (fs.existsSync(filePath)) {
      res.download(filePath, fileName);
    } else {
      res.status(404).json({ message: "File missing from server" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error downloading file" });
  }
});

module.exports = router;
