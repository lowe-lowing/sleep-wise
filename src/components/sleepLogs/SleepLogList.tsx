"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type SleepLog, CompleteSleepLog } from "@/lib/db/schema/sleepLogs";
import Modal from "@/components/shared/Modal";

import { useOptimisticSleepLogs } from "@/app/(app)/sleep-logs/useOptimisticSleepLogs";
import { Button } from "@/components/ui/button";
import SleepLogForm from "./SleepLogForm";
import { PlusIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

type TOpenModal = (sleepLog?: SleepLog) => void;

export default function SleepLogList({
  sleepLogs,
}: {
  sleepLogs: CompleteSleepLog[];
}) {
  const { optimisticSleepLogs, addOptimisticSleepLog } =
    useOptimisticSleepLogs(sleepLogs);
  const [open, setOpen] = useState(false);
  const [activeSleepLog, setActiveSleepLog] = useState<SleepLog | null>(null);
  const openModal = (sleepLog?: SleepLog) => {
    setOpen(true);
    sleepLog ? setActiveSleepLog(sleepLog) : setActiveSleepLog(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeSleepLog ? "Edit SleepLog" : "Create Sleep Log"}
      >
        {/* <ScrollArea className="max-h-[80vh] overflow-y-auto"> */}
        <SleepLogForm
          sleepLog={activeSleepLog}
          addOptimistic={addOptimisticSleepLog}
          openModal={openModal}
          closeModal={closeModal}
        />
        {/* </ScrollArea> */}
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticSleepLogs.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSleepLogs.map((sleepLog) => (
            <SleepLog
              sleepLog={sleepLog}
              key={sleepLog.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const SleepLog = ({
  sleepLog,
  openModal,
}: {
  sleepLog: CompleteSleepLog;
  openModal: TOpenModal;
}) => {
  const optimistic = sleepLog.id === "optimistic";
  const deleting = sleepLog.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("sleep-logs")
    ? pathname
    : pathname + "/sleep-logs/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{sleepLog.date}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + sleepLog.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No sleep logs
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new sleep log.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Sleep Logs{" "}
        </Button>
      </div>
    </div>
  );
};
