import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function InteractiveMap() {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-background p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              Trip Highlights Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1sIFXUnr021_gfhcgthkZ2xSdAGnGl2Q&ehbc=2E312F"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Trip Highlights Map"
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
