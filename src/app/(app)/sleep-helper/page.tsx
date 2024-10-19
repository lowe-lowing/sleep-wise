import Chat from "@/components/Chat";
import { getSleepLogs } from "@/lib/api/sleepLogs/queries";

export default async function Page() {
  const { sleepLogs } = await getSleepLogs();

  return <Chat sleepLogs={sleepLogs} />;
}
