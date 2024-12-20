import React from 'react';
import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
    </div>
  );
}