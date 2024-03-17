// app/dashboard/tutors/page.jsx
'use client';

import React, { Suspense } from 'react';
import PtTable from '@/components/pt_table';
import { useState, useEffect } from 'react';
import Loading from '../loading';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from '../error';

export default function TutorsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/v1/assistants');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        setData(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={<Error />}>
        <PtTable data={data} />
      </ErrorBoundary>
    </Suspense>
  );
}
