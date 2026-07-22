ALTER TABLE "cargo_reports" ADD COLUMN "paid" boolean DEFAULT false NOT NULL;
-- Expand phase: keep "profit" until the new application version is deployed and verified.
