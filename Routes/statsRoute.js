const express = require("express");
const router = express.Router();
const statsController = require("../Controller/statsController");

router.route("/blog-stats").get(statsController.getStats);
router.route("/blog-search").get(statsController.getStatsQuery);

module.exports = router;
