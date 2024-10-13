import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  SleepLogId,
  NewSleepLogParams,
  UpdateSleepLogParams,
  updateSleepLogSchema,
  insertSleepLogSchema,
  sleepLogs,
  sleepLogIdSchema,
} from "@/lib/db/schema/sleepLogs";
import { getUserAuth } from "@/lib/auth/utils";

export const createSleepLog = async (sleepLog: NewSleepLogParams) => {
  const { session } = await getUserAuth();
  const newSleepLog = insertSleepLogSchema.parse({ ...sleepLog, userId: session?.user.id! });
  try {
    const [s] = await db.insert(sleepLogs).values(newSleepLog).returning();
    return { sleepLog: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSleepLog = async (id: SleepLogId, sleepLog: UpdateSleepLogParams) => {
  const { session } = await getUserAuth();
  const { id: sleepLogId } = sleepLogIdSchema.parse({ id });
  const newSleepLog = updateSleepLogSchema.parse({ ...sleepLog, userId: session?.user.id! });

  try {
    const [s] = await db
      .update(sleepLogs)
      .set({ ...newSleepLog, updatedAt: new Date() })
      .where(and(eq(sleepLogs.id, sleepLogId!), eq(sleepLogs.userId, session?.user.id!)))
      .returning();

    return { sleepLog: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSleepLog = async (id: SleepLogId) => {
  const { session } = await getUserAuth();
  const { id: sleepLogId } = sleepLogIdSchema.parse({ id });
  try {
    const [s] = await db
      .delete(sleepLogs)
      .where(and(eq(sleepLogs.id, sleepLogId!), eq(sleepLogs.userId, session?.user.id!)))
      .returning();
    return { sleepLog: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
