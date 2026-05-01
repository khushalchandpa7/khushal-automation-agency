const express = require("express");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const { validate } = require("../middleware/validate");
const { createLeadSchema } = require("../schemas/lead.schema");

const router = express.Router();

function calculateLeadScore(lead) {
  let score = 20;

  if (lead.roiMonthlyLoss >= 10000) score += 35;
  else if (lead.roiMonthlyLoss >= 5000) score += 25;
  else if (lead.roiMonthlyLoss >= 1000) score += 15;

  const quizAnswerCount = lead.quizAnswers
    ? Object.keys(lead.quizAnswers).length
    : 0;
  if (quizAnswerCount >= 4) score += 20;
  else if (quizAnswerCount > 0) score += 10;

  if (lead.selectedPainPoint) score += 10;
  if (lead.sourceSection && lead.sourceSection !== "lead-form") score += 5;
  if (lead.painPoints && lead.painPoints.length > 80) score += 10;

  return Math.min(score, 100);
}

router.post("/", validate(createLeadSchema), async (req, res, next) => {
  try {
    const {
      name,
      email,
      company,
      painPoints,
      website,
      sourceSection,
      selectedPainPoint,
      roiMonthlyLoss,
      roiPayload,
      quizAnswers,
      recommendedAutomation,
      utmCampaign,
    } = req.validated;
    const leadScore = calculateLeadScore(req.validated);

    // Honeypot: if a value is present, return a believable 201 without writing
    // to the DB. Bots think they succeeded; we keep our DB clean.
    if (website && website.trim().length > 0) {
      return res.status(201).json({
        id: crypto.randomUUID(),
        name,
        email,
        company: company && company.length > 0 ? company : null,
        status: "NEW",
        leadScore,
        createdAt: new Date().toISOString(),
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: company && company.length > 0 ? company : null,
        painPoints,
        sourceSection,
        selectedPainPoint,
        roiMonthlyLoss,
        roiPayload,
        quizAnswers,
        recommendedAutomation,
        leadScore,
        utmCampaign,
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        leadScore: true,
        recommendedAutomation: true,
        createdAt: true,
      },
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
