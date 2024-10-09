import { Suspense } from "react";

import Loading from "@/app/loading";
import SleepLogList from "@/components/sleepLogs/SleepLogList";
import { getSleepLogs } from "@/lib/api/sleepLogs/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function SleepLogsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Sleep Logs</h1>
        </div>
        <SleepLogs />
      </div>
    </main>
  );
}

const SleepLogs = async () => {
  await checkAuth();

  const { sleepLogs } = await getSleepLogs();
  
  return (
    <Suspense fallback={<Loading />}>
      <SleepLogList sleepLogs={sleepLogs}  />
    </Suspense>
  );
};
