"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/sleep-logs/useOptimisticSleepLogs";
import { type SleepLog } from "@/lib/db/schema/sleepLogs";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import SleepLogForm from "@/components/sleepLogs/SleepLogForm";
import { format } from "date-fns";

export default function OptimisticSleepLog({ sleepLog }: { sleepLog: SleepLog }) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticSleepLog, setOptimisticSleepLog] = useOptimistic(sleepLog);
  const updateSleepLog: TAddOptimistic = (input) => setOptimisticSleepLog({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <SleepLogForm
          sleepLog={optimisticSleepLog}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSleepLog}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{format(optimisticSleepLog.date, "PPP")}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticSleepLog.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticSleepLog, null, 2)}
      </pre>
      {/* <p>{format(sleepLog.sleepTime, "yyyy-MM-dd HH-mm")}</p> */}
    </div>
  );
}
