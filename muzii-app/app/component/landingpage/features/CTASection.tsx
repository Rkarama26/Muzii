import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <Card className="mx-auto max-w-4xl border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl text-balance">
              Ready to Transform Your Streams?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
              Join thousands of creators who are already building stronger communities through
              interactive music experiences. Start your journey today.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                Schedule Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
