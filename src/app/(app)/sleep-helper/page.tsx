import Chat from "@/components/Chat";
import { getSleepLogs } from "@/lib/api/sleepLogs/queries";

export default async function Page() {
  const { sleepLogs } = await getSleepLogs();

  const formattedLogs = sleepLogs
    .map((log) => `Date: ${log.date}, Sleep: ${log.sleepTime}, Wake: ${log.wakeTime}`)
    .join("\n");

  const prompt = `Analyze the following sleep logs and provide a weekly analysis of sleep quality, patterns, and suggestions for improvement:\n\n${formattedLogs}`;

  console.log(prompt);

  return <Chat initialPrompt={prompt} />;
}
