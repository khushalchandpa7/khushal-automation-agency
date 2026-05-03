const express = require("express");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const { notifyNewLead } = require("../lib/notifyLead");
const { validate } = require("../middleware/validate");
const { createLeadSchema } = require("../schemas/lead.schema");

const router = express.Router();

const ROI_SCORE_THRESHOLDS_INR = {
  high: 800000,
  medium: 400000,
  low: 80000,
};

const LEAD_SCORE_WEIGHTS = {
  base: 20,
  roiHigh: 35,
  roiMedium: 25,
  roiLow: 15,
  quizFull: 20,
  quizPartial: 10,
  quizFullThreshold: 4,
  selectedPainPoint: 10,
  nonFormSource: 5,
  longPainPoints: 10,
  longPainPointsLength: 80,
  cap: 100,
};

const normalizeCompany = (value) =>
  value && value.length > 0 ? value : null;

/**
 * Score a lead 0-100 from base + ROI tier + quiz completeness
 * + pain-point detail + source bonus, capped at LEAD_SCORE_WEIGHTS.cap.
 */
function calculateLeadScore(lead) {
  let score = LEAD_SCORE_WEIGHTS.base;

  if (lead.roiMonthlyLoss >= ROI_SCORE_THRESHOLDS_INR.high) {
    score += LEAD_SCORE_WEIGHTS.roiHigh;
  } else if (lead.roiMonthlyLoss >= ROI_SCORE_THRESHOLDS_INR.medium) {
    score += LEAD_SCORE_WEIGHTS.roiMedium;
  } else if (lead.roiMonthlyLoss >= ROI_SCORE_THRESHOLDS_INR.low) {
    score += LEAD_SCORE_WEIGHTS.roiLow;
  }

  const quizAnswerCount = lead.quizAnswers
    ? Object.keys(lead.quizAnswers).length
    : 0;
  if (quizAnswerCount >= LEAD_SCORE_WEIGHTS.quizFullThreshold) {
    score += LEAD_SCORE_WEIGHTS.quizFull;
  } else if (quizAnswerCount > 0) {
    score += LEAD_SCORE_WEIGHTS.quizPartial;
  }

  if (lead.selectedPainPoint) score += LEAD_SCORE_WEIGHTS.selectedPainPoint;
  if (lead.sourceSection && lead.sourceSection !== "lead-form") {
    score += LEAD_SCORE_WEIGHTS.nonFormSource;
  }
  if (
    lead.painPoints &&
    lead.painPoints.length > LEAD_SCORE_WEIGHTS.longPainPointsLength
  ) {
    score += LEAD_SCORE_WEIGHTS.longPainPoints;
  }

  return Math.min(score, LEAD_SCORE_WEIGHTS.cap);
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
    const normalizedCompany = normalizeCompany(company);

    // Honeypot: if a value is present, return a believable 201 without writing
    // to the DB. Bots think they succeeded; we keep our DB clean.
    if (website && website.trim().length > 0) {
      return res.status(201).json({
        id: crypto.randomUUID(),
        name,
        email,
        company: normalizedCompany,
        status: "NEW",
        leadScore,
        createdAt: new Date().toISOString(),
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: normalizedCompany,
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

    // Fire-and-forget email notification. notifyNewLead never throws.
    notifyNewLead({
      id: lead.id,
      name,
      email,
      company: normalizedCompany,
      painPoints,
      sourceSection,
      selectedPainPoint,
      roiMonthlyLoss,
      roiPayload,
      quizAnswers,
      recommendedAutomation,
      leadScore,
      utmCampaign,
      createdAt: lead.createdAt,
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
