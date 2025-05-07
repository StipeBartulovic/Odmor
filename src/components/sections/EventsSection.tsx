"use client";

import type { LocalEvent } from '@/services/events';
import { getLocalEvents } from '@/services/events';
import { useEffect, useState } from 'react';
import { EventCard } from '@/components/shared/EventCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, CalendarSearch } from 'lucide-react';

export function EventsSection() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [initialEventsLoaded, setInitialEventsLoaded] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      const fetchedEvents = await getLocalEvents();
       // For demo: Add more diverse events with future dates
      const demoEvents: LocalEvent[] = [
        { name: "Summer Music Fest", description: "Three days of live music from various artists.", date: new Date(new Date().setDate(new Date().getDate() + 30)), link: "https://example.com/musicfest" },
        { name: "Artisan Craft Fair", description: "Discover unique handmade crafts from local artisans.", date: new Date(new Date().setDate(new Date().getDate() + 7)), link: "https://example.com/craftfair" },
        { name: "Food Truck Rally", description: "A variety of delicious food trucks all in one place.", date: new Date(new Date().setDate(new Date().getDate() + 14)), link: "https://example.com/foodrally" },
        { name: "Charity Fun Run", description: "5K run/walk for a good cause, suitable for all ages.", date: new Date(new Date().setDate(new Date().getDate() + 45)), link: "https://example.com/funrun" },
      ];
      setEvents([...fetchedEvents, ...demoEvents].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setInitialEventsLoaded(true);
    }
    if (!initialEventsLoaded) {
        loadEvents();
    }
  }, [initialEventsLoaded]);

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="bg-muted/50 p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <CalendarSearch className="h-8 w-8" />
              Local Events & Happenings
            </CardTitle>
            {/* Placeholder for filter button - non-functional for now */}
            <Button variant="outline" className="rounded-lg shadow-sm flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No local events listed at the moment. Check back soon!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
