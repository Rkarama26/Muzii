import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Radio, Heart } from "lucide-react"

const features = [
  {
    icon: Vote,
    title: "Fan-Driven Playlists",
    description: "Your audience votes on the next song in real-time, creating the perfect collaborative soundtrack.",
  },
  {
    icon: Radio,
    title: "Live Streaming Integration",
    description: "Seamlessly integrate with your existing streaming setup. Works with all major platforms.",
  },
  {
    icon: Heart,
    title: "Community Building",
    description: "Build stronger connections with your audience through shared musical experiences.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Simple, interactive music streaming that brings creators and fans together.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
