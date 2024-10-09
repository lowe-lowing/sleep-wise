import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSleepLog,
  deleteSleepLog,
  updateSleepLog,
} from "@/lib/api/sleepLogs/mutations";
import { 
  sleepLogIdSchema,
  insertSleepLogParams,
  updateSleepLogParams 
} from "@/lib/db/schema/sleepLogs";

export async function POST(req: Request) {
  try {
    const validatedData = insertSleepLogParams.parse(await req.json());
    const { sleepLog } = await createSleepLog(validatedData);

    revalidatePath("/sleepLogs"); // optional - assumes you will have named route same as entity

    return NextResponse.json(sleepLog, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateSleepLogParams.parse(await req.json());
    const validatedParams = sleepLogIdSchema.parse({ id });

    const { sleepLog } = await updateSleepLog(validatedParams.id, validatedData);

    return NextResponse.json(sleepLog, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = sleepLogIdSchema.parse({ id });
    const { sleepLog } = await deleteSleepLog(validatedParams.id);

    return NextResponse.json(sleepLog, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
