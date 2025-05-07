import { AppHeader } from '@/components/shared/AppHeader';
import { AiPromptInterface } from '@/components/sections/AiPromptInterface';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { ActivitiesSection } from '@/components/sections/ActivitiesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12 md:space-y-16">
        <AiPromptInterface />
        <InteractiveMap />
        <ActivitiesSection />
        <EventsSection />

        {/* New Tips & Tricks Button Section */}
        <section className="py-8 md:py-12 text-center">
          <Link href="/tips" passHref>
            <Button size="lg" className="rounded-xl shadow-lg px-8 py-6 text-lg" variant="outline">
              <Lightbulb className="mr-3 h-6 w-6 text-accent" />
              Local Tips & Info
            </Button>
          </Link>
        </section>
      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Stibar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
