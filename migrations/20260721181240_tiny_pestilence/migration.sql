CREATE TABLE "cargo_reports" (
	"id" uuid PRIMARY KEY,
	"user_id" text NOT NULL,
	"plate" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"load_number" text DEFAULT '' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"driver" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"full_value" integer DEFAULT 0 NOT NULL,
	"fuel_cost" integer DEFAULT 0 NOT NULL,
	"toll_cost" integer DEFAULT 0 NOT NULL,
	"other_cost" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
