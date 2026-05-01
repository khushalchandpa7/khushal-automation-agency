const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { title: "asc" },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
