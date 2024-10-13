import { db } from "@/lib/db/index";
import { eq, and, desc } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type SleepLogId, sleepLogIdSchema, sleepLogs } from "@/lib/db/schema/sleepLogs";

export const getSleepLogs = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(sleepLogs)
    .where(eq(sleepLogs.userId, session?.user.id!))
    .orderBy(desc(sleepLogs.date));
  const s = rows;
  return { sleepLogs: s };
};

export const getSleepLogById = async (id: SleepLogId) => {
  const { session } = await getUserAuth();
  const { id: sleepLogId } = sleepLogIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(sleepLogs)
    .where(and(eq(sleepLogs.id, sleepLogId), eq(sleepLogs.userId, session?.user.id!)));
  if (row === undefined) return {};
  const s = row;
  return { sleepLog: s };
};
