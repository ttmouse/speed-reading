'use client'

import * as React from 'react';
import { Reader } from '@/app/components';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">速读训练</h1>
      <Reader />
    </main>
  );
} 