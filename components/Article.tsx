"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, MessageCircle, MessageCirclePlus } from "lucide-react"
import { AIChat } from "@/components/AIChat"
import { Message } from "@ai-sdk/react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useContent } from "@/lib/hooks/useContent"
import { Database } from "@/types/database.types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

type ArticleProps = Database["public"]["Tables"]["articles"]["Row"] & {
  objections:{
    id: number;
    text: string[];
}[],
replies:{
  id: number;
  text: string[];
}[],
  question: Database["public"]["Tables"]["questions"]["Row"]
  treatise: Database["public"]["Tables"]["treatises"]["Row"]
  part: Database["public"]["Tables"]["parts"]["Row"]
}

type ArticleContextInfo = {
  part: { title: string, original_id: string }
  treatise: { title: string, original_id: number }
  question: { title: string, original_id: number }
  article: { title: string[], original_id: number }
}

const createInitialContext = (context: ArticleContextInfo) => {
  return `Current Context:
- Part ${context.part.original_id}: ${context.part.title}
- Treatise ${context.treatise.original_id}: ${context.treatise.title}
- Question ${context.question.original_id}: ${context.question.title}
- Article ${context.article.original_id}: ${context.article.title[0]}

Please focus your responses on this specific article and its theological context and nothing more.`
}

export function Article({ title, objections, counter, body, replies, question, treatise, part }: ArticleProps) {
  const welcomeMessage = `
Welcome! I am Thomas AI, your guide to understanding the Summa Theologica.
I can help you:
* Understand complex theological concepts
* Explain the structure of arguments
* Provide historical context
* Connect ideas across different parts of the Summa
* Answer questions about specific articles
How can I assist you with this article?`

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const chatOpen = searchParams.get('chatOpen')
  const router = useRouter()
  const {id} = useParams()
  
  const context = {
    part: {
      original_id: part.original_id,
      title: part.title
    },
    treatise: {
      original_id: treatise.original_id,
      title: treatise.title
    },
    question: {
      original_id: question.original_id,
      title: question.title
    },
    article: {
      original_id: parseInt(id.toString().split('-')[3].slice(2)),
      title: title
    }
  }
 
  
  const initMsg = [{ role: "assistant", content: welcomeMessage } as Message]
  const [activeTab, setActiveTab] = useState("objections")
  const [isChatOpen, setIsChatOpen] = useState(chatOpen !==null && chatOpen == 'true')
  const [initialMessages, setInitialMessages] = useState<Message[]>(initMsg)

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const currentId = id as string
  const [prevId, nextId] = useMemo(() => {
    const parts = currentId.split('-')
    // Extract just the number from the article ID (e.g., "Ar5" -> 5)
    const articleNum = parseInt(parts[3].slice(2))
    const prevArticleId = `${parts[0]}-${parts[1]}-${parts[2]}-Ar${articleNum - 1}`
    const nextArticleId = `${parts[0]}-${parts[1]}-${parts[2]}-Ar${articleNum + 1}`
    
    return [
      articleNum > 1 ? prevArticleId : null,
      nextArticleId
    ]
  }, [currentId])

  // Check if previous and next articles exist
  const [prevArticleExists, setPrevArticleExists] = useState(false)
  const [nextArticleExists, setNextArticleExists] = useState(false)
  
  // Fetch previous article if prevId exists
  const { data: prevArticleData, isLoading: isPrevLoading } = useContent(
    prevId || ""
  )
  
  // Fetch next article
  const { data: nextArticleData, isLoading: isNextLoading } = useContent(
    nextId || ""
  )
  
  // Update state based on API responses
  useEffect(() => {
    if (!isPrevLoading && prevArticleData && prevArticleData.article) {
      setPrevArticleExists(true)
    }
  }, [prevArticleData, isPrevLoading])
  
  useEffect(() => {
    if (!isNextLoading && nextArticleData && nextArticleData.article) {
      setNextArticleExists(true)
    }
  }, [nextArticleData, isNextLoading])

  useEffect(() => {
    if(isChatOpen) {
      router.push(pathname + '?' + createQueryString('chatOpen', 'true'))
    } else {
      router.push(pathname)
    }
  }, [isChatOpen])
  

  return (
    <div className="relative pb-16">
      <h2 className="text-2xl font-semibold mb-4">{title[0]}</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="objections">Objections</TabsTrigger>
          <TabsTrigger value="answer">Answer</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="objections" className="space-y-10">
          {objections.map((objection,ind) => (
            <div key={objection.id} className={cn("pb-2",ind < objections.length-1 && "border-b-2")}>
              <h4 className="font-semibold">Objection {objection.id}</h4>
              {objection.text.map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="answer" className="space-y-10">
          <div className={cn("pb-2",counter.length > 0 && "border-b")}>
            {counter.map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
          </div>
          <div>
            {body.map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="replies" className="space-y-10">
          {replies.map((reply,ind) => (
            <div key={reply.id} className={cn("pb-2",ind < replies.length-1 && "border-b-2")}>
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

      <div className="mt-8 flex justify-between items-center gap-4">
          <Button variant={"outline"} disabled={!prevId || !prevArticleExists}>
            <Link className={"flex items-center gap-2"} href={`/explore/${prevId}`} prefetch>
              {isPrevLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <ChevronLeft />}
              Previous Article
            </Link>
          </Button>
        
          <Button variant={"outline"} disabled={!nextId || !nextArticleExists}>
            <Link className={"flex items-center gap-2"} href={`/explore/${nextId}`} prefetch>
              Next Article
              {isNextLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <ChevronRight />}
            </Link>
          </Button>
      </div>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
      <DialogTrigger asChild>
        <Button className="z-50 fixed bottom-20 right-4 rounded-full w-12 h-12 p-0" onClick={() => {setIsChatOpen(true)}}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] p-2 md:p-6">
        <DialogHeader>
          <DialogTitle>Thomas AI</DialogTitle>
          <DialogDescription>
            <Button className="rounded-sm gap-2" size="sm" onClick={()=>{setInitialMessages(initMsg)}}>
              New Chat<MessageCirclePlus className="h-4 w-4" />
            </Button>
          </DialogDescription>
        </DialogHeader>
        <AIChat 
            initialMessages={initialMessages}
            setInitialMessages={setInitialMessages}
            articleContext={context ? createInitialContext(context) : undefined}
            welcomeMessage={welcomeMessage}
          />  
      </DialogContent>
    </Dialog>

      

      
    </div>
  )
}