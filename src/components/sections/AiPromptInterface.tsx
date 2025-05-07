"use client";

import *import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Users, DollarSign, Car, Sparkles, Search } from "lucide-react";
import { format } from "date-fns";

export function AiPromptInterface() {
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [numPeople, setNumPeople] = useState<string>("1");
  const [budgetOption, setBudgetOption] = useState<string | undefined>(undefined);
  const [customBudget, setCustomBudget] = useState<string>("");
  const [vehicleAvailable, setVehicleAvailable] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  // Effect to set initial arrivalDate to today to avoid hydration mismatch
  useEffect(() => {
    setArrivalDate(new Date());
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder for future submission logic
    console.log("Form submitted (visually)");
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-muted/50 p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <Sparkles className="h-8 w-8" />
              Plan Your Next Adventure
            </CardTitle>
            <CardDescription className="text-base">
              Describe your dream trip, and let our AI craft the perfect itinerary for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* AI Search Bar */}
              <div className="space-y-3">
                <Label htmlFor="ai-prompt" className="text-lg font-medium flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Tell us about your trip
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ai-prompt"
                    type="text"
                    placeholder="e.g., A relaxing 5-day beach vacation in Bali with some cultural experiences"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow text-base p-3 rounded-lg shadow-sm"
                  />
                  <Button type="submit" size="lg" className="rounded-lg shadow-sm flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Generate
                  </Button>
                </div>
              </div>

              {/* Structured Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t mt-6">
                <div className="space-y-2">
                  <Label htmlFor="num-people" className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Number of People</Label>
                  <Input
                    id="num-people"
                    type="number"
                    min="1"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="rounded-md shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival-date" className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />Arrival Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal rounded-md shadow-sm"
                        id="arrival-date"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {arrivalDate ? format(arrivalDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={arrivalDate}
                        onSelect={setArrivalDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="daily-budget" className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />Daily Budget (per person)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={budgetOption} onValueChange={setBudgetOption}>
                      <SelectTrigger className="rounded-md shadow-sm flex-grow">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<50">Under $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value=">200">Over $200</SelectItem>
                        <SelectItem value="custom">Custom Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    {budgetOption === "custom" && (
                      <Input
                        type="number"
                        placeholder="Enter average daily amount"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        className="rounded-md shadow-sm flex-grow"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 flex flex-col items-start">
                  <Label htmlFor="vehicle-availability" className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" />Vehicle Availability</Label>
                  <div className="flex items-center space-x-2 p-2 border rounded-md shadow-sm bg-background w-full">
                    <Switch
                      id="vehicle-availability"
                      checked={vehicleAvailable}
                      onCheckedChange={setVehicleAvailable}
                    />
                    <Label htmlFor="vehicle-availability" className="text-sm">
                      {vehicleAvailable ? "Yes, we have a vehicle" : "No, we don't have a vehicle"}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="preferences" className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Preferences (Likes & Dislikes)</Label>
                  <Textarea
                    id="preferences"
                    placeholder="e.g., Love hiking and quiet beaches, dislike crowded tourist spots and spicy food."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="min-h-[100px] rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-6 border-t mt-6">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  Our custom-built AI system will use this data, combined with a location-specific prompt, to automatically generate up to three multi-day travel plans tailored to your group. Each plan includes destinations, travel time, cost estimates, nearby dining spots, and more.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
