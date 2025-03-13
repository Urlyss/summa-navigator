"use client"

import { useRef, useEffect, useState, FormEvent } from "react"
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Square } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { availableModels, aiModes } from "@/ai_config"
import { useChat } from "@ai-sdk/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { TextDotsLoader } from "./ui/text-dots-loader"
import { Markdown } from "./ui/markdown"

function ChatReasoning({ parts, isLoading }: { parts: Message['parts'], isLoading: boolean }) {
  return (
    <div className="bg-muted p-2 rounded-lg text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        {isLoading && <TextDotsLoader size="sm" text="Reasoning"/>}
        {!isLoading && <div className="font-medium">Reasoned for a few seconds</div>}
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
        <span className={`inline-block p-2 rounded-lg text-sm ${
          message.role === "user" && "bg-primary text-primary-foreground" 
        }`}>
          <Markdown>{message.content}</Markdown>
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
  stop: () => void
}) {
  return (
    <form onSubmit={handleSubmit} className="border-input bg-background rounded-3xl border p-2 shadow-xs">
      <Textarea
        ref={textareaRef}
        placeholder="Ask me anything..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
          }
        }}
        className="text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-end justify-between gap-2">
        <div className="flex gap-2 flex-1 items-end">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-24 h-8 text-xs overflow-hidden text-ellipsis">
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
            <SelectTrigger className="w-24 h-8 text-xs overflow-hidden">
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
        <Button type="submit" size="icon" className="w-8 h-8 rounded-full" onClick={isLoading ? stop : undefined}>
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

  const { messages, input, handleInputChange, handleSubmit, status, stop, setMessages, error, reload,setInput } = useChat({
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

  useEffect(() => {
    if(messages.length > initialMessages.length){
      resetChat()
    }
  }, [initialMessages])
  
  const message = messages[messages.length-1]
  const hasReasoning = message && message.parts && message.parts.filter(part => part.type === "reasoning").length > 0
  const suggestedActions = ["Explain this article to me.", "What is the main idea of this article?", "What is the conclusion of this article?", "What are the key points of this article?"]

  return (
    <div className="flex flex-col w-full h-[75vh] md:h-[80dvh] bg-background ">
      <ScrollArea className="flex-grow mb-4 max-w-none" ref={scrollAreaRef}>
          <div className="flex flex-col min-w-0 gap-6 flex-1 pr-4">
            {messages?.map((message, index) => (
              <ChatMessage key={index} message={message} isLoading={isLoading} />
            ))}
          {error && (
            <div className="text-xs space-y-2">
              <div className="text-destructive">An error occurred.</div>
              <Button variant="destructive" size="sm" onClick={()=>reload()}>
                Retry
              </Button>
            </div>
          )}
          {isLoading && !hasReasoning && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextDotsLoader size="sm"/>
              </div>
            </div>
          )}
            <div ref={endOfMessagesRef} className="shrink-0 min-w-[24px] min-h-[24px]"
      />
        </div>
      </ScrollArea>
      <div className="grid grid-cols-2 gap-2 w-full my-2 ">
      {suggestedActions.map((suggestedAction, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={async () => {setInput(suggestedAction)}}
            size="sm"
            className="text-left border rounded-xl p-2 text-xs flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="text-muted-foreground">
              {suggestedAction}
            </span>
          </Button>
      ))}
    </div>
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
        stop={stop}
      />
    </div>
  )
}

