DROP INDEX IF EXISTS "sleep_log_user_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sleep_log_user_id_idx" ON "sleep_logs" USING btree ("user_id");