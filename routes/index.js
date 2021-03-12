const express = require("express");

const router = express.Router();

router.use("/api/v1/product", require("./product"));
router.use("/api/v1/category", require("./category"));

module.exports = router;
