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
import {
  AlertDialog,
  Button,
  Container,
  Dialog,
  Flex,
  IconButton,
  Text,
} from '@radix-ui/themes';
import PtTutorModal from '@/components/pt_tutor_modal';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import PtAlertDialog from '@/components/pt_alert_dialog';

export default function TutorsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  const url = 'http://127.0.0.1:8000/';

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
        const res = await fetch(`${url}v1/tutors?${queryString}`);
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
      const res = await fetch(`${url}v1/tutors?${queryString}`, {
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
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(`${url}v1/tutors/${assistantId}?${queryString}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
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
      const res = await fetch(`${url}v1/tutors/${assistantId}?${queryString}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  const columns = [
    {
      header: 'Name',
      render: (item) => <Text>{item.name}</Text>,
    },
    {
      header: 'Model',
      render: (item) => <Text>{item.model}</Text>,
    },
    {
      header: 'Instruction',
      render: (item) => <Text>{item.instructions}</Text>,
    },
    {
      header: 'Created',
      render: (item) => (
        <Text>
          {new Date(item.created_at * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      ),
    },
    {
      header: 'Actions',
      render: (item) => <Flex gap='3'>{renderRowActions(item)}</Flex>,
    },
  ];

  const renderRowActions = (item) => (
    <>
      <PtTutorModal
        title={'Edit Personal Tutor'}
        subtitle={'Personal tutor details'}
        item={item}
        onSave={updateTutor}
      >
        <Dialog.Trigger>
          <IconButton variant='soft'>
            <FiEdit />
          </IconButton>
        </Dialog.Trigger>
      </PtTutorModal>

      <PtAlertDialog
        title={'Delete Personal Tutor'}
        description={
          <>
            Are you sure you want to delete <strong>{item.name}</strong>? This
            action cannot be undone.
          </>
        }
        buttonTitle={'Delete'}
        onSubmit={() => deleteTutor(item.id)}
      >
        <AlertDialog.Trigger>
          <IconButton variant='soft' color='red'>
            <FiTrash />
          </IconButton>
        </AlertDialog.Trigger>
      </PtAlertDialog>
    </>
  );

  return (
    <ErrorBoundary FallbackComponent={<Error />}>
      <Container>
        {/* create modal */}
        <PtTutorModal
          title={`Create Tutor`}
          subtitle={`Tutor details`}
          onSave={createTutor}
        >
          <Flex justify='between'>
            {/* title */}
            <Flex direction='column'>
              <Text size='4' as='b'>
                Tutors
              </Text>
              <Text color='gray' size='2'>
                Your Personal Tutors
              </Text>
            </Flex>

            {/* dialog cta */}
            <Dialog.Trigger>
              <Button>
                <FiPlus width='16' height='16' /> Create
              </Button>
            </Dialog.Trigger>
          </Flex>
        </PtTutorModal>

        <PtTable
          data={data}
          isLoading={isLoading}
          error={error}
          columns={columns}
          renderRowActions={renderRowActions}
        />
      </Container>
    </ErrorBoundary>
  );
}
