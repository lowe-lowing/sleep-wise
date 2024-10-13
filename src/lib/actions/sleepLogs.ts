"use server";

import { revalidatePath } from "next/cache";
import { createSleepLog, deleteSleepLog, updateSleepLog } from "@/lib/api/sleepLogs/mutations";
import {
  SleepLogId,
  NewSleepLogParams,
  UpdateSleepLogParams,
  sleepLogIdSchema,
  insertSleepLogParams,
  updateSleepLogParams,
} from "@/lib/db/schema/sleepLogs";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateSleepLogs = () => revalidatePath("/sleep-logs");

export const createSleepLogAction = async (input: NewSleepLogParams) => {
  try {
    const payload = insertSleepLogParams.parse(input);
    await createSleepLog(payload);
    revalidateSleepLogs();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSleepLogAction = async (input: UpdateSleepLogParams) => {
  try {
    const payload = updateSleepLogParams.parse(input);
    await updateSleepLog(payload.id, payload);
    revalidateSleepLogs();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteSleepLogAction = async (input: SleepLogId) => {
  try {
    const payload = sleepLogIdSchema.parse({ id: input });
    await deleteSleepLog(payload.id);
    revalidateSleepLogs();
  } catch (e) {
    return handleErrors(e);
  }
};
