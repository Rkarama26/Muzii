'use client';

import { Toaster } from 'react-hot-toast';

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-card-foreground)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        },
        success: {
          style: {
            background: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          },
        },
        error: {
          style: {
            background: 'var(--color-destructive)',
            color: 'var(--color-destructive-foreground)',
          },
        },
        loading: {
          style: {
            background: 'var(--color-muted)',
            color: 'var(--color-muted-foreground)',
          },
        },
      }}
    />
  );
}
