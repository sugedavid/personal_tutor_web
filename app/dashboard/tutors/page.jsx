// app/dashboard/tutors/page.jsx
'use client';

import PtTable from '@/components/pt_table';
import firebase_app from '@/firebase';
import { useToast } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Error from '../error';

export default function TutorsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  useEffect(() => {
    fetchTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch tutors
  const fetchTutors = async () => {
    if (user !== null) {
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { token: idToken };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(
          `http://127.0.0.1:8000/v1/tutors?${queryString}`
        );
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
    } else {
      router.push('/sign_in');
    }
  };

  // create tutor
  const createTutor = async (createData) => {
    try {
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(
        `http://127.0.0.1:8000/v1/tutors?${queryString}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        }
      );
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
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(
        `http://127.0.0.1:8000/v1/tutors/${assistantId}?${queryString}`,
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
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(
        `http://127.0.0.1:8000/v1/tutors/${assistantId}?${queryString}`,
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
