import type { LocalEvent } from '@/services/events';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Link as LinkIcon, Info } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: LocalEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span> {/* Ensure date is Date object */}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full rounded-lg shadow-sm hover:bg-accent/10">
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            More Info
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
