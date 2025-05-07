"use client";

import type { Activity } from '@/services/activities';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { DollarSign, Leaf, Palette, Info } from 'lucide-react'; // Palette for generic activity icon

interface ActivityCardProps {
  activity: Activity;
  icon?: React.ElementType; // Allow passing specific icon component
}

export function ActivityCard({ activity, icon: IconComponent = Palette }: ActivityCardProps) {
  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={activity.name} className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 bg-primary/10 rounded-lg">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-grow text-left">
                <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                <Badge variant={activity.isFree ? "secondary" : "default"} className="mt-1 text-xs">
                  {activity.isFree ? <Leaf className="mr-1 h-3 w-3" /> : <DollarSign className="mr-1 h-3 w-3" />}
                  {activity.isFree ? "Free" : "Paid"}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <div className="space-y-3">
              {activity.iconUrl && activity.iconUrl.startsWith('https://picsum.photos') && (
                 <Image
                    src={activity.iconUrl}
                    alt={activity.name}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full aspect-[16/10]"
                    data-ai-hint="activity outdoor"
                  />
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
              {/* Placeholder for provider dropdowns or transport info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                <Info className="h-4 w-4" />
                <span>Further details and provider options available.</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
