"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { useEffect } from "react";

type ChatProps = {
  initialPrompt: string;
};

export default function Chat({ initialPrompt }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat();

  useEffect(() => {
    append({ role: "user", content: initialPrompt });
  }, [initialPrompt]);
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Sleep Analysis based on latest week of sleep</h1>

      {messages[1] && (
        <p className="text-gray-700 dark:text-gray-300 my-4 whitespace-pre-wrap">{messages[1].content}</p>
      )}
      <div className="flex flex-1 flex-col gap-4">
        <form className="grid gap-4 md:gap-6" onSubmit={handleSubmit}>
          <Input id="question" placeholder="Type your question here..." value={input} onChange={handleInputChange} />
          <Button>Ask AI</Button>
        </form>
        <div className="p-4">
          <h3 className="font-semibold">AI Response:</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Your AI response will appear here.</p>
          <div className="space-y-2">
            {messages.toSpliced(0, 2).map((m) => (
              <div key={m.id} className="text-gray-700 dark:text-gray-300 my-4 whitespace-pre-wrap">
                <b>{m.role === "user" ? "User: " : "AI: "}</b>
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
