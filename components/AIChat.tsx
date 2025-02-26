"use client"

import { useRef, useEffect, useState, FormEvent } from "react"
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, Square, Trash } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { availableModels, aiModes } from "@/ai_config"
import { useChat } from "@ai-sdk/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

function ChatReasoning({ parts, isLoading }: { parts: Message['parts'], isLoading: boolean }) {
  return (
    <div className="bg-muted p-2 rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Reasoning</span>
      </div>
      <Accordion type="single" collapsible>
        {parts && parts.map((part, index) => part.type === "reasoning" && (
          <AccordionItem 
            key={index}
            value={`value-${index+1}`} 
            className={index === parts.filter(p => p.type === "reasoning").length-1 ? "border-none" : ""}
          >
            <AccordionTrigger className="text-xs">
              <span className="line-clamp-1">{part.reasoning}</span>
            </AccordionTrigger>
            <AccordionContent className="text-xs">
              <ReactMarkdown>{part.reasoning}</ReactMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function ChatMessage({ message, isLoading }: { message: Message, isLoading: boolean }) {
  const hasReasoning = message.parts && message.parts.filter(part => part.type === "reasoning").length > 0

  return (
    <div className={`mb-2 flex flex-col gap-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
      {hasReasoning && <ChatReasoning parts={message.parts} isLoading={isLoading} />}
      <div>
        <span className={`inline-block p-2 rounded-lg ${
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </span>
      </div>
    </div>
  )
}

function ChatInput({ 
  input, 
  isLoading, 
  model, 
  aiMode, 
  textareaRef,
  handleInputChange,
  handleSubmit,
  setModel,
  setAiMode,
  resetChat,
  stop
}: {
  input: string
  isLoading: boolean
  model: string
  aiMode: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  setModel: (value: string) => void
  setAiMode: (value: string) => void
  resetChat: () => void
  stop: () => void
}) {
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <Textarea
        ref={textareaRef}
        placeholder="Message..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
          }
        }}
        className="mb-2 resize-none focus-visible:ring-0 min-h-[44px] border-0"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-1">
          <Button size="icon" className="rounded-sm bg-destructive" onClick={resetChat}>
            <Trash className="h-4 w-4 text-destructive-foreground" />
          </Button>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-32 text-xs overflow-hidden">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.value} value={model.value} className="text-xs">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={aiMode} onValueChange={setAiMode}>
            <SelectTrigger className="w-32 text-xs overflow-hidden">
              <SelectValue placeholder="Select AI mode" />
            </SelectTrigger>
            <SelectContent>
              {aiModes.map((mode) => (
                <SelectItem key={mode.value} value={mode.value} className="text-xs">
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="icon" className="rounded-full" onClick={isLoading ? stop : undefined}>
          {isLoading ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}

export function AIChat({
  initialMessages,
  setInitialMessages,
  articleContext,
  welcomeMessage
}: {
  initialMessages: Message[]
  setInitialMessages: (messages: Message[]) => void
  articleContext?: string
  welcomeMessage?: string
}) {
  const [model, setModel] = useState<string>(availableModels[0].value)
  const [aiMode, setAiMode] = useState(aiModes[0].value)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit, status, stop, setMessages, error, reload } = useChat({
    maxSteps: 5,
    body: { aiMode, model, articleContext }
  })

  const isLoading = (status === 'submitted' || status === 'streaming')

  useEffect(() => {
    if (messages && messages.length === 0) {
      setMessages(initialMessages)
    }
  }, [])

  useEffect(() => {
    if (messages && messages.length > 0) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
      setInitialMessages(messages)
    }
  }, [messages])

  const resetChat = () => {
    const initMessage = [{ role: "assistant", content: welcomeMessage } as Message]
    setMessages(initMessage)
    setInitialMessages(initMessage)
  }

  return (
    <div className="flex flex-col h-full bg-background prose dark:prose-invert prose-sm">
      <h3 className="text-lg font-semibold mb-2 p-4 border-b">Thomas AI</h3>
      <ScrollArea className="flex-grow mb-4 max-w-none" ref={scrollAreaRef}>
        <div className="p-4">
          {messages?.map((message, index) => (
            <ChatMessage key={index} message={message} isLoading={isLoading} />
          ))}
          {error && (
            <>
              <div>An error occurred.</div>
              <Button variant="link" onClick={()=>reload()} className="flex gap-2 items-center text-destructive">
                Retry
              </Button>
            </>
          )}
          {isLoading && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      <ChatInput
        input={input}
        isLoading={isLoading}
        model={model}
        aiMode={aiMode}
        textareaRef={textareaRef}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setModel={setModel}
        setAiMode={setAiMode}
        resetChat={resetChat}
        stop={stop}
      />
    </div>
  )
}

