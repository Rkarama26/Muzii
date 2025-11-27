import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import SignIn from './sigin/SignIn';
import { ThemeToggle } from './ThemeToggle';
import Redirect from './Redirect';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <img src="/muzii-icon.png" alt="Muzii" className="h-16 w-16" />
          <span className="text-xl font-bold text-foreground">Muzii</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 ml-8">
          {/* <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a> */}
          <a
            href="#creators"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Creators
          </a>
          <a
            href="#community"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Community
          </a>
        </nav>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <SignIn />
          <Redirect />
          <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
