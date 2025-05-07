
'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, supportedLanguages } from "@/contexts/LanguageContext";
import { Languages, Check } from "lucide-react";

export function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage, currentLanguageConfig } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" aria-label="Change language">
          <Languages className="h-[1.2rem] w-[1.2rem] mr-1" />
          <span className="text-xs font-semibold">{currentLanguageConfig.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className="flex items-center justify-between"
          >
            {language.name} ({language.displayName})
            {selectedLanguage === language.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
