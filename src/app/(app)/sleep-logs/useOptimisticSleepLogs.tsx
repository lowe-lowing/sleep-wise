
import { type SleepLog, type CompleteSleepLog } from "@/lib/db/schema/sleepLogs";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<SleepLog>) => void;

export const useOptimisticSleepLogs = (
  sleepLogs: CompleteSleepLog[],
  
) => {
  const [optimisticSleepLogs, addOptimisticSleepLog] = useOptimistic(
    sleepLogs,
    (
      currentState: CompleteSleepLog[],
      action: OptimisticAction<SleepLog>,
    ): CompleteSleepLog[] => {
      const { data } = action;

      

      const optimisticSleepLog = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticSleepLog]
            : [...currentState, optimisticSleepLog];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticSleepLog } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticSleepLog, optimisticSleepLogs };
};
