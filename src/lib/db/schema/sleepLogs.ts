import { sql } from "drizzle-orm";
import {
  date,
  timestamp,
  text,
  integer,
  varchar,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getSleepLogs } from "@/lib/api/sleepLogs/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const sleepLogs = pgTable(
  "sleep_logs",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    date: date("date").notNull(),
    sleepTime: timestamp("sleep_time").notNull(),
    wakeTime: timestamp("wake_time").notNull(),
    sleepQuality: integer("sleep_quality"),
    mood: integer("mood"),
    screenTimeBeforeSleep: integer("screen_time_before_sleep"),
    caffeineIntake: integer("caffeine_intake"),
    exercise: integer("exercise"),
    stressLevel: integer("stress_level"),
    notes: text("notes"),
    userId: varchar("user_id", { length: 256 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  (sleepLogs) => {
    return {
      userIdIndex: uniqueIndex("sleep_log_user_id_idx").on(sleepLogs.userId),
    };
  }
);

// Schema for sleepLogs - used to validate API requests
const baseSchema = createSelectSchema(sleepLogs).omit(timestamps);

export const insertSleepLogSchema =
  createInsertSchema(sleepLogs).omit(timestamps);
export const insertSleepLogParams = baseSchema
  .extend({
    date: z.coerce.string().min(1),
    sleepTime: z.coerce.date(),
    wakeTime: z.coerce.date(),
    sleepQuality: z.coerce.number(),
    mood: z.coerce.number(),
    screenTimeBeforeSleep: z.coerce.number(),
    caffeineIntake: z.coerce.number(),
    exercise: z.coerce.number(),
    stressLevel: z.coerce.number(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateSleepLogSchema = baseSchema;
export const updateSleepLogParams = baseSchema
  .extend({
    date: z.coerce.string().min(1),
    sleepTime: z.coerce.date(),
    wakeTime: z.coerce.date(),
    sleepQuality: z.coerce.number(),
    mood: z.coerce.number(),
    screenTimeBeforeSleep: z.coerce.number(),
    caffeineIntake: z.coerce.number(),
    exercise: z.coerce.number(),
    stressLevel: z.coerce.number(),
  })
  .omit({
    userId: true,
  });
export const sleepLogIdSchema = baseSchema.pick({ id: true });

// Types for sleepLogs - used to type API request params and within Components
export type SleepLog = typeof sleepLogs.$inferSelect;
export type NewSleepLog = z.infer<typeof insertSleepLogSchema>;
export type NewSleepLogParams = z.infer<typeof insertSleepLogParams>;
export type UpdateSleepLogParams = z.infer<typeof updateSleepLogParams>;
export type SleepLogId = z.infer<typeof sleepLogIdSchema>["id"];

// this type infers the return from getSleepLogs() - meaning it will include any joins
export type CompleteSleepLog = Awaited<
  ReturnType<typeof getSleepLogs>
>["sleepLogs"][number];
