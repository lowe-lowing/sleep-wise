import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/sleep-logs/useOptimisticSleepLogs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { type SleepLog, insertSleepLogParams } from "@/lib/db/schema/sleepLogs";
import {
  createSleepLogAction,
  deleteSleepLogAction,
  updateSleepLogAction,
} from "@/lib/actions/sleepLogs";

const SleepLogForm = ({
  sleepLog,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  sleepLog?: SleepLog | null;

  openModal?: (sleepLog?: SleepLog) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<SleepLog>(insertSleepLogParams);
  const editing = !!sleepLog?.id;
  const [date, setDate] = useState<Date | undefined>(
    sleepLog ? new Date(sleepLog.date) : undefined
  );
  const [sleepTime, setSleepTime] = useState<Date | undefined>(
    sleepLog?.sleepTime
  );
  const [wakeTime, setWakeTime] = useState<Date | undefined>(
    sleepLog?.wakeTime
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("sleep-logs");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: SleepLog }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`SleepLog ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const sleepLogParsed = await insertSleepLogParams.safeParseAsync({
      ...payload,
    });
    if (!sleepLogParsed.success) {
      setErrors(sleepLogParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = sleepLogParsed.data;
    const pendingSleepLog: SleepLog = {
      updatedAt: sleepLog?.updatedAt ?? new Date(),
      createdAt: sleepLog?.createdAt ?? new Date(),
      id: sleepLog?.id ?? "",
      userId: sleepLog?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingSleepLog,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateSleepLogAction({ ...values, id: sleepLog.id })
          : await createSleepLogAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingSleepLog,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form
      action={handleSubmit}
      onChange={handleChange}
      className={"space-y-8 max-h-[80vh] overflow-y-auto px-1"}
    >
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.date ? "text-destructive" : ""
          )}
        >
          Date
        </Label>
        <br />
        <Popover>
          <Input
            name="date"
            onChange={() => {}}
            readOnly
            value={date?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !sleepLog?.date && "text-muted-foreground"
              )}
            >
              {date ? (
                <span>{format(date, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setDate(e)}
              selected={date}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.date ? (
          <p className="text-xs text-destructive mt-2">{errors.date[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.sleepTime ? "text-destructive" : ""
          )}
        >
          Sleep Time
        </Label>
        <br />
        <Popover>
          <Input
            name="sleepTime"
            onChange={() => {}}
            readOnly
            value={sleepTime?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !sleepLog?.sleepTime && "text-muted-foreground"
              )}
            >
              {sleepTime ? (
                <span>{format(sleepTime, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setSleepTime(e)}
              selected={sleepTime}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.sleepTime ? (
          <p className="text-xs text-destructive mt-2">{errors.sleepTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.wakeTime ? "text-destructive" : ""
          )}
        >
          Wake Time
        </Label>
        <br />
        <Popover>
          <Input
            name="wakeTime"
            onChange={() => {}}
            readOnly
            value={wakeTime?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !sleepLog?.wakeTime && "text-muted-foreground"
              )}
            >
              {wakeTime ? (
                <span>{format(wakeTime, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setWakeTime(e)}
              selected={wakeTime}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.wakeTime ? (
          <p className="text-xs text-destructive mt-2">{errors.wakeTime[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.sleepQuality ? "text-destructive" : ""
          )}
        >
          Sleep Quality
        </Label>
        <Input
          type="text"
          name="sleepQuality"
          className={cn(errors?.sleepQuality ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.sleepQuality ?? ""}
        />
        {errors?.sleepQuality ? (
          <p className="text-xs text-destructive mt-2">
            {errors.sleepQuality[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.mood ? "text-destructive" : ""
          )}
        >
          Mood
        </Label>
        <Input
          type="text"
          name="mood"
          className={cn(errors?.mood ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.mood ?? ""}
        />
        {errors?.mood ? (
          <p className="text-xs text-destructive mt-2">{errors.mood[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.screenTimeBeforeSleep ? "text-destructive" : ""
          )}
        >
          Screen Time Before Sleep
        </Label>
        <Input
          type="text"
          name="screenTimeBeforeSleep"
          className={cn(
            errors?.screenTimeBeforeSleep ? "ring ring-destructive" : ""
          )}
          defaultValue={sleepLog?.screenTimeBeforeSleep ?? ""}
        />
        {errors?.screenTimeBeforeSleep ? (
          <p className="text-xs text-destructive mt-2">
            {errors.screenTimeBeforeSleep[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.caffeineIntake ? "text-destructive" : ""
          )}
        >
          Caffeine Intake
        </Label>
        <Input
          type="text"
          name="caffeineIntake"
          className={cn(errors?.caffeineIntake ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.caffeineIntake ?? ""}
        />
        {errors?.caffeineIntake ? (
          <p className="text-xs text-destructive mt-2">
            {errors.caffeineIntake[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.exercise ? "text-destructive" : ""
          )}
        >
          Exercise
        </Label>
        <Input
          type="text"
          name="exercise"
          className={cn(errors?.exercise ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.exercise ?? ""}
        />
        {errors?.exercise ? (
          <p className="text-xs text-destructive mt-2">{errors.exercise[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.stressLevel ? "text-destructive" : ""
          )}
        >
          Stress Level
        </Label>
        <Input
          type="text"
          name="stressLevel"
          className={cn(errors?.stressLevel ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.stressLevel ?? ""}
        />
        {errors?.stressLevel ? (
          <p className="text-xs text-destructive mt-2">
            {errors.stressLevel[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.notes ? "text-destructive" : ""
          )}
        >
          Notes
        </Label>
        <Input
          type="text"
          name="notes"
          className={cn(errors?.notes ? "ring ring-destructive" : "")}
          defaultValue={sleepLog?.notes ?? ""}
        />
        {errors?.notes ? (
          <p className="text-xs text-destructive mt-2">{errors.notes[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: "delete", data: sleepLog });
              const error = await deleteSleepLogAction(sleepLog.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: sleepLog,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default SleepLogForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
