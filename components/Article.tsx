"use client"

import { useCallback, useMemo, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button, buttonVariants } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { AIChat } from "@/components/AIChat"
import { Message } from "@ai-sdk/react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { getContent } from "@/lib/getContent"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type ArticleProps = {
  title: string[]
  objections: { id: number; text: string[] }[]
  counter: string[]
  body: string[]
  replies: { id: number; text: string[] }[]
}

type ArticleContextInfo = {
  part: { title: string, id: string }
  treatise: { title: string, id: number }
  question: { title: string, id: number }
  article: { title: string[], id: number }
}

const createInitialContext = (context:ArticleContextInfo) => {
  return `Current Context:
- Part ${context.part.id}: ${context.part.title}
- Treatise ${context.treatise.id}: ${context.treatise.title}
- Question ${context.question.id}: ${context.question.title}
- Article ${context.article.id}: ${context.article.title[0]}

Please focus your responses on this specific article and its theological context and nothing more.`
}

export function Article({ title, objections, counter, body, replies }: ArticleProps) {

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
  const content = getContent(id as string)
  const context = {part:{id:content?.part.id!,title:content?.part.title!},treatise:{id:content?.treatise?.id!,title:content?.treatise?.title!},question:{id:content?.question?.id!,title:content?.question?.title!},article:{id:content?.article?.id!,title:content?.article?.title!}}
  const [activeTab, setActiveTab] = useState("objections")
  const [isChatOpen, setIsChatOpen] = useState(chatOpen !==null && chatOpen == 'true')
  const [initialMessages, setInitialMessages] = useState<Message[]>(
    [{ role: "assistant", content: welcomeMessage } as Message]
  )

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
    // Extract just the number from the article ID (e.g., "a5" -> 5)
    const articleNum = parseInt(parts[3].slice(2))
    const prevArticleId = `${parts[0]}-${parts[1]}-${parts[2]}-Ar${articleNum - 1}`
    const nextArticleId = `${parts[0]}-${parts[1]}-${parts[2]}-Ar${articleNum + 1}`
    
    return [
      getContent(prevArticleId) ? prevArticleId : null,
      getContent(nextArticleId) ? nextArticleId : null
    ]
  }, [currentId])

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
            <div key={reply.id} className={cn("pb-2",ind < objections.length-1 && "border-b-2")}>
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
        {prevId ? (
            <Link className={cn(buttonVariants({ variant: "outline" }),"flex items-center gap-2")} href={`/explore/${prevId}`} prefetch>
              <ChevronLeft />
              Previous Article
            </Link>
        ) : (
          <div /> 
        )}
        
        {nextId ? (
            <Link className={cn(buttonVariants({ variant: "outline" }),"flex items-center gap-2")} href={`/explore/${nextId}`} prefetch>
              Next Article
              <ChevronRight />
            </Link>
        ) : (
          <div /> 
        )}
      </div>

      <Button className="z-50 fixed bottom-20 right-4 rounded-full w-12 h-12 p-0" onClick={() => {
        if(isChatOpen) {
          router.push(pathname)
        } else {
          router.push(pathname + '?' + createQueryString('chatOpen', `${!isChatOpen}`))
        }
        setIsChatOpen(!isChatOpen)
        }}>
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-36 right-4 w-1/4 h-4/6 rounded-lg shadow-lg flex flex-col overflow-hidden">
          <AIChat 
            initialMessages={initialMessages}
            setInitialMessages={setInitialMessages}
            articleContext={createInitialContext(context)}
            welcomeMessage={welcomeMessage}
          />
        </div>
      )}
    </div>
  )
}

