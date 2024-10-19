import Chat from "@/components/Chat";
import { getSleepLogs } from "@/lib/api/sleepLogs/queries";
import { format } from "date-fns";

export default async function Page() {
  const { sleepLogs } = await getSleepLogs();

  const formattedLogs = sleepLogs
    .map(
      (log) =>
        `Date: ${format(log.date, "yyyy-MM-dd")}, Sleep: ${format(
          log.sleepTime,
          "yyyy-MM-dd HH:mm"
        )}, Wake: ${format(log.wakeTime, "yyyy-MM-dd HH:mm")}`
    )
    .join("\n");

  const prompt = `Analyze the following sleep logs and provide a weekly analysis of sleep quality, patterns, and suggestions for improvement:\n\n${formattedLogs}`;

  console.log(prompt);
  return <p className="whitespace-pre-wrap">{prompt}</p>;

  // return <Chat initialPrompt={prompt} />;
}
