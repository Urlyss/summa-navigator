"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { AIChat } from "@/components/AIChat"
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText, streamText } from 'ai';

type Message = {
  role: "user" | "assistant"
  content: string
}

type ArticleProps = {
  title: string[]
  objections: { id: number; text: string[] }[]
  counter: string[]
  body: string[]
  replies: { id: number; text: string[] }[]
}

export function Article({ title, objections, counter, body, replies }: ArticleProps) {
  const [activeTab, setActiveTab] = useState("objections")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const openrouter = createOpenRouter({
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  });

  const handleSendMessage = async (input: string) => {
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
        
    setTimeout(() => {
      const aiMessage: Message = { 
        role: "assistant", 
        content: `You said:\n${input}` 
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen pb-16">
      <h2 className="text-2xl font-semibold mb-4">{title[0]}</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="objections">Objections</TabsTrigger>
          <TabsTrigger value="counter">Counter</TabsTrigger>
          <TabsTrigger value="answer">Answer</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="objections">
          {objections.map((objection) => (
            <div key={objection.id} className="mb-4">
              <h4 className="font-semibold">Objection {objection.id}</h4>
              {objection.text.map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="counter">
          {counter.map((paragraph, index) => (
            <p key={index} className="mb-2">
              {paragraph}
            </p>
          ))}
        </TabsContent>
        <TabsContent value="answer">
          {body.map((paragraph, index) => (
            <p key={index} className="mb-2">
              {paragraph}
            </p>
          ))}
        </TabsContent>
        <TabsContent value="replies">
          {replies.map((reply) => (
            <div key={reply.id} className="mb-4">
              <h4 className="font-semibold">Reply to Objection {reply.id}</h4>
              {reply.text.map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0" onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-1/5 h-3/5 rounded-lg shadow-lg flex flex-col overflow-hidden">
          <AIChat 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}

