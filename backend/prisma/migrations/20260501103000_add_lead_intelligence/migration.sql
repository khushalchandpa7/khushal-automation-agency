-- AlterTable
ALTER TABLE "Lead"
ADD COLUMN "sourceSection" TEXT,
ADD COLUMN "selectedPainPoint" TEXT,
ADD COLUMN "roiMonthlyLoss" INTEGER,
ADD COLUMN "roiPayload" JSONB,
ADD COLUMN "quizAnswers" JSONB,
ADD COLUMN "recommendedAutomation" TEXT,
ADD COLUMN "leadScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "utmCampaign" JSONB;

-- CreateIndex
CREATE INDEX "Lead_leadScore_idx" ON "Lead"("leadScore");
