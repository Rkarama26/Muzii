import { Button } from "@/components/ui/button"
import { Play, Users, Music2 } from "lucide-react"
import Redirect from "../Redirect"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Let Your Fans Choose The Beat
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
            Stream your content while your audience picks the soundtrack. The music streaming platform where creators
            and fans collaborate in real-time.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Start Streaming
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              <Users className="mr-2 h-5 w-5" />
              Join as Fan
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
