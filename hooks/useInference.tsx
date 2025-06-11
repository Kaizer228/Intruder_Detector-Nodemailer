'use client';

import { useState } from 'react';

export function useInference() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const runInference = async (imageBlob: Blob) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = await blobToBase64(imageBlob);

      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch inference result');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err: any) {
      console.error('Inference error:', err);
      setError(err.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { runInference, loading, error, result };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
