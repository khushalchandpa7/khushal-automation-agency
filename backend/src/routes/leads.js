const express = require("express");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const { validate } = require("../middleware/validate");
const { createLeadSchema } = require("../schemas/lead.schema");

const router = express.Router();

router.post("/", validate(createLeadSchema), async (req, res, next) => {
  try {
    const { name, email, company, painPoints, website } = req.validated;

    // Honeypot: if a value is present, return a believable 201 without writing
    // to the DB. Bots think they succeeded; we keep our DB clean.
    if (website && website.trim().length > 0) {
      return res.status(201).json({
        id: crypto.randomUUID(),
        name,
        email,
        company: company && company.length > 0 ? company : null,
        status: "NEW",
        createdAt: new Date().toISOString(),
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: company && company.length > 0 ? company : null,
        painPoints,
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
