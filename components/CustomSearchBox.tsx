'use client'
import {liteClient} from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Pagination,
  useInstantSearch,
} from "react-instantsearch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Loader2, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner"

const getContentType = (id: string): string => {
  const depth = id.split("-").length
  const types = {
    1: "part",
    2: "treatise",
    3: "question",
    4: "article"
  }
  return types[depth as keyof typeof types] || ""
}

//@ts-ignore
function Hit({ hit }) {
  const type = getContentType(hit.id)
  return (
    <DialogClose asChild>
      <Link
        href={`/explore/${hit.id}`}
        className="w-100 block hover:bg-secondary/85 py-2 px-4"
      >
        <div className="flex justify-between items-center">
          <Highlight
            attribute="title"
            hit={hit}
            classNames={{ highlighted: "bg-primary text-primary-foreground" }}
          />
          <div>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        {type && (
          <span className="text-xs text-muted-foreground">
            {`click to see the ${type}`}
          </span>
        )}
      </Link>
    </DialogClose>
  );
}

function SearchErrorToast() {
  const { addMiddlewares } = useInstantSearch()
  const [error, setError] = useState<Error | null>(null)
  const [hasShownError, setHasShownError] = useState(false)

  useEffect(() => {
    const middleware = ({ instantSearchInstance }: { instantSearchInstance: any }) => {
      const handleError = (searchError: Error) => {
        setError(searchError)
      }

      return {
        subscribe() {
          instantSearchInstance.addListener("error", handleError)
        },
        unsubscribe() {
          instantSearchInstance.removeListener("error", handleError)
        },
      }
    }

    return addMiddlewares(middleware)
  }, [addMiddlewares])

  useEffect(() => {
    if (error && !hasShownError) {
      setHasShownError(true)
      console.log(error)
      toast.error("Error with the search engine.", {
        action: {
          label: "Reload Page",
          onClick: () => window.location.reload(),
        },
      })
    }

    return setHasShownError(false)
  }, [error])

  return null
}

function LoadingIndicator() {
  const { status } = useInstantSearch();

  
  if (status === 'loading' || status === 'stalled') {
    return <div className="flex flex-row items-center gap-4">
              <Loader2 className="animate-spin w-4 h-4"/>
              <p>Loading search results</p>
          </div>;
  }
  
  return null;
}

const searchBoxClassNames = {
  form: "flex w-full max-w-sm items-center space-x-2",
  submit: "mx-2 p-2 bg-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  submitIcon: "h-4 w-4 fill-primary-foreground",
  loadingIcon: "m-2 h-4 w-4 fill-primary-foreground",
  resetIcon: "h-4 w-4 fill-destructive-foreground",
  reset: "mx-2 p-2 bg-destructive inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  input: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
}

const paginationClassNames = {
  list: "mx-auto flex w-full justify-center gap-2",
  item: "p-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  selectedItem: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
}

const CustomSearchBox = () => {
  const searchClient = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.NEXT_PUBLIC_ALGOLIA_API_KEY) {
      return null
    }
    return liteClient(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
    )
  }, [])

  if (!searchClient) return null
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-light">
          <SearchIcon className="lg:mr-2 h-4 w-4" />
          <span className="lg:flex hidden">Search in Summa...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[70dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search in the entire app here.</DialogDescription>
        </DialogHeader>
        <InstantSearch searchClient={searchClient} indexName="summa">
          <SearchErrorToast />
          <SearchBox
            placeholder="Type here"
            classNames={searchBoxClassNames}
          />
          <LoadingIndicator />
          <Hits hitComponent={Hit} />
          <Pagination classNames={paginationClassNames} />
        </InstantSearch>
      </DialogContent>
    </Dialog>
  )
}

export default CustomSearchBox;