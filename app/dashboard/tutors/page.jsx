// app/dashboard/tutors/page.jsx
'use client';

import PtTable from '@/components/pt_table';
import { useToast } from '@chakra-ui/react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useEffect, useState } from 'react';
import Error from '../error';

export default function TutorsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdateError, setUpdateError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    fetchTutors();
  }, []);

  // fetch tutors
  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/v1/tutors');
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

  // create tutor
  const createTutor = async (createData) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/v1/tutors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        throw new Error('Failed to create personal tutor');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Personal tutor create successfully', 'success');
      fetchTutors();
    } catch (err) {
      toastMessage('Failed to create personal tutor', 'error');
      setUpdateError(err);
    }
  };

  // update tutor
  const updateTutor = async (assistantId, updatedData) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/v1/tutors/${assistantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update personal tutor');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Personal tutor updated successfully', 'success');
      fetchTutors();
    } catch (err) {
      toastMessage('Failed to update personal tutor', 'error');
      setUpdateError(err);
    }
  };

  // delete tutor
  const deleteTutor = async (assistantId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/v1/tutors/${assistantId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete personal tutor');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Personal tutor deleted successfully', 'success');
      fetchTutors();
    } catch (err) {
      toastMessage('Failed to delete personal tutor', 'error');
      setUpdateError(err);
    }
  };

  const toastMessage = (title, status) => {
    toast({
      title: title,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <ErrorBoundary FallbackComponent={<Error />}>
      <PtTable
        data={data}
        isLoading={isLoading}
        error={error}
        onCreate={createTutor}
        onUpdate={updateTutor}
        onDelete={deleteTutor}
      />
    </ErrorBoundary>
  );
}
