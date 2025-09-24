import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"

export function SignInSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Music2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to Start?</h2>
          <p className="mb-8 text-muted-foreground">
            Join creators and fans in the ultimate music streaming experience
          </p>
          <Button size="lg" className="px-8 py-3 text-lg">
            Sign In
          </Button>
        </div>
      </div>
    </section>
  )
}
