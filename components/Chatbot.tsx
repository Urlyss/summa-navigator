"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Fragment, useEffect, useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { useQuery } from "@tanstack/react-query";
import { aiModes } from "@/ai_config";
import { Suggestion, Suggestions } from "./ai-elements/suggestion";
import { Button } from "./ui/button";

const fetchModels = async () => {
  const response = await fetch("/api/models");
  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  const data = await response.json();
  return data;
};

const ChatBot = ({
  initialMessages,
  articleContext,
}: {
  initialMessages: UIMessage[];
  articleContext?: string;
}) => {
  const {
    data: availableModels = [],
    isLoading: isModelsLoading,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  // Default to first model or fallback to a safe default
  const defaultModel =
    availableModels.length > 0
      ? availableModels[0].value
      : "deepseek/deepseek-r1:free";

  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(defaultModel);
  const [aiMode, setAiMode] = useState(aiModes[0].value);
  const suggestions = [
    "Explain this article to me.",
    "What is the main idea of this article?",
    "What is the conclusion of this article?",
    "What are the key points of this article?",
  ];

  const { messages, sendMessage, status, regenerate, setMessages } = useChat({
    messages: initialMessages,
  });

  const resetChat = () => {
    setMessages(initialMessages);
  };

  useEffect(() => {
    if (messages.length > initialMessages.length) {
      resetChat();
    }
  }, [initialMessages]);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) {
      return;
    }

    sendMessage(
      { text: message.text },
      { body: { aiMode, model, articleContext } }
    );
    setInput("");
  };

  return (
    <div className="w-full p-2 relative h-[75vh] md:h-[80dvh]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message, ind) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            ind === messages.length - 1 &&
                            ind != 0 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() =>
                                    regenerate({
                                      body: { aiMode, model, articleContext },
                                    })
                                  }
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <Suggestions className="grid grid-cols-2 gap-2 w-full my-2 ">
          {suggestions.map((suggestion) => (
            <Suggestion
            className="text-wrap p-6"
              key={suggestion}
              onClick={async () => {
                setInput(suggestion);
              }}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect
                value={!isModelsLoading ? model : undefined}
                disabled={isModelsLoading}
                onValueChange={(value) => {
                  setModel(value);
                }}
              >
                <PromptInputModelSelectTrigger className="capitalize">
                  <PromptInputModelSelectValue
                    placeholder={
                      isModelsLoading ? "Loading..." : "Select a model"
                    }
                  />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {isModelsLoading ? (
                    <PromptInputModelSelectItem
                      value="loading"
                      disabled
                      className="text-xs"
                    >
                      Loading models...
                    </PromptInputModelSelectItem>
                  ) : (
                    availableModels.map(
                      (model: { label: string; value: string }) => (
                        <PromptInputModelSelectItem
                          key={model.value}
                          value={model.value}
                          className="capitalize"
                        >
                          {model.label}
                        </PromptInputModelSelectItem>
                      )
                    )
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      refetchModels();
                    }}
                  >
                    <RefreshCcwIcon className="h-3 w-3" />
                    Refresh models
                  </Button>
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setAiMode(value);
                }}
                value={aiMode}
              >
                <PromptInputModelSelectTrigger className="capitalize">
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {aiModes.map((mode: { label: string; value: string }) => (
                    <PromptInputModelSelectItem
                      key={mode.value}
                      value={mode.value}
                      className="capitalize"
                    >
                      {mode.label}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBot;
