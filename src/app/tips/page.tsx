
'use client';

import React from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { tipsData, type TipCategory, type Tip } from '@/data/tips';
import { 
  Globe, Lightbulb, Wrench, CarFront, PlugZap, Utensils, Umbrella, Info, ExternalLink,
  ShieldAlert, Droplets, Landmark, Activity as ActivityIcon, Clock, Smartphone, Phone, TrafficCone, Ship, Bike, Squirrel,
  Power, BatteryCharging, Plug, Coins, Receipt, CigaretteOff, MessageSquare, Languages, Sun, Footprints, Ticket, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Helper function to get Lucide icon component based on string name
const getIcon = (iconName?: string): React.ElementType => {
  if (!iconName) return Lightbulb; // Default icon if none specified for a tip
  switch (iconName) {
    case 'Globe': return Globe;
    case 'Lightbulb': return Lightbulb;
    case 'Wrench': return Wrench;
    case 'CarFront': return CarFront;
    case 'PlugZap': return PlugZap;
    case 'Utensils': return Utensils;
    case 'Umbrella': return Umbrella;
    case 'Info': return Info;
    case 'ShieldAlert': return ShieldAlert;
    case 'Droplets': return Droplets;
    case 'Landmark': return Landmark;
    case 'ActivityIcon': return ActivityIcon; // Renamed to avoid conflict with React.Activity
    case 'Clock': return Clock;
    case 'Smartphone': return Smartphone;
    case 'Phone': return Phone;
    case 'TrafficCone': return TrafficCone;
    case 'Ship': return Ship;
    case 'Bike': return Bike;
    case 'Squirrel': return Squirrel;
    case 'Power': return Power;
    case 'BatteryCharging': return BatteryCharging;
    case 'Plug': return Plug;
    case 'Coins': return Coins;
    case 'Receipt': return Receipt;
    case 'CigaretteOff': return CigaretteOff;
    case 'MessageSquare': return MessageSquare;
    case 'Languages': return Languages;
    case 'Sun': return Sun;
    case 'Footprints': return Footprints;
    case 'Ticket': return Ticket;
    default: return Lightbulb;
  }
};

export default function TipsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="rounded-lg shadow-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Globe className="h-10 w-10" />
            Travel Smart: Everything They Don’t Tell You in the Brochure
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Practical, non-touristy knowledge to help you feel more confident and informed during your stay in Croatia.
          </p>
        </header>

        <div className="space-y-8">
          {tipsData.map((category: TipCategory) => (
            <Card key={category.title} className="shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30 p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                  {React.createElement(getIcon(category.icon), { className: "h-7 w-7" })}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0"> {/* Remove padding here, apply in Accordion items if needed */}
                <Accordion type="multiple" className="w-full">
                  {category.tips.map((tip: Tip, index: number) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${category.title.replace(/\s+/g, '-')}-${index}`} 
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="text-base md:text-lg font-medium hover:no-underline py-3 px-4 md:px-6 text-left">
                        <div className="flex items-center gap-2 w-full">
                          {tip.icon && React.createElement(getIcon(tip.icon), { className: "h-5 w-5 text-primary shrink-0" })}
                          <span className="flex-grow">{tip.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm md:text-base text-muted-foreground pt-1 pb-3 px-4 md:px-6 space-y-2">
                        <p>{tip.description}</p>
                        {tip.link && (
                          <Link
                            href={tip.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline"
                          >
                            {tip.link.text} <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* "Did you know?" section */}
        <Card className="shadow-xl rounded-xl mt-12">
          <CardHeader className="bg-muted/30 p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
              <Info className="h-7 w-7" />
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 text-muted-foreground space-y-2">
            <p>This section can be updated with interesting local quirks, customs, or fun facts about Croatia!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Croatia is home to the world's smallest town, Hum.</li>
              <li>The necktie (cravat) was invented in Croatia.</li>
              <li>The Dalmatian dog breed originates from the Dalmatia region of Croatia.</li>
            </ul>
            <p className="text-xs italic mt-4">More tips and user suggestions can be added here in the future.</p>
          </CardContent>
        </Card>

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
