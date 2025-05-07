import { PlaneTakeoff } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';

export function AppHeader() {
  return (
    <header className="py-8 bg-background shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlaneTakeoff className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Stibar
          </h1>
        </div>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
