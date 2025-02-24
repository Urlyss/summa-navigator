"use client"

import type React from "react"
import { useRef, useEffect,useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

type AIChatProps = {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function AIChat({ messages, onSendMessage, isLoading }: AIChatProps) {
  const [input, setInput] = useState("")
  const [model, setModel] = useState("gemini-2")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSendMessage = async () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-grow textarea
    e.target.style.height = "auto"
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  useEffect(() => {
    if (messages.length > 0) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-background">
      <h3 className="text-lg font-semibold mb-2 p-4">Thomas AI</h3>
      <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
        <div className="p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg whitespace-pre-wrap ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Textarea
          ref={textareaRef}
          placeholder="Message..."
          value={input}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          className="mb-2 resize-none focus-visible:ring-0 min-h-[44px] border-0"
          rows={1}
        />
        <div className="flex items-center justify-between gap-2">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2">Gemini 2.0 Flash</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="claude">Claude 3</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSendMessage} size="icon" className="rounded-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

