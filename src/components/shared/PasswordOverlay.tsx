'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';

interface PasswordOverlayProps {
  onAuthenticate: (password: string) => boolean;
}

export function PasswordOverlay({ onAuthenticate }: PasswordOverlayProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error
    if (onAuthenticate(password)) {
      // Parent component will handle hiding this overlay by re-rendering
    } else {
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear password field on error
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-border">
        <KeyRound className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Travel deeper. Go beyond the brochure.
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Please enter the password to access Stibar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center text-lg h-12 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            aria-label="Password"
            autoFocus
          />
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          <Button type="submit" className="w-full text-lg py-3 rounded-lg shadow-md bg-primary hover:bg-primary/90 h-12">
            Unlock Stibar
          </Button>
        </form>
      </div>
    </div>
  );
}
