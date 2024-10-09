import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSleepLogById } from "@/lib/api/sleepLogs/queries";
import OptimisticSleepLog from "./OptimisticSleepLog";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function SleepLogPage({
  params,
}: {
  params: { sleepLogId: string };
}) {

  return (
    <main className="overflow-auto">
      <SleepLog id={params.sleepLogId} />
    </main>
  );
}

const SleepLog = async ({ id }: { id: string }) => {
  await checkAuth();

  const { sleepLog } = await getSleepLogById(id);
  

  if (!sleepLog) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="sleep-logs" />
        <OptimisticSleepLog sleepLog={sleepLog}  />
      </div>
    </Suspense>
  );
};
