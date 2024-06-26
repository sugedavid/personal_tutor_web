// app/dashboard/tutors/page.jsx
'use client';

import PtAlertDialog from '@/components/pt_alert_dialog';
import PtTable from '@/components/pt_table';
import { toastMessage } from '@/components/pt_toast';
import PtTutorModal from '@/components/pt_tutor_modal';
import firebase_app, { perf } from '@/firebase';
import { useToast } from '@chakra-ui/react';
import {
  AlertDialog,
  Button,
  Container,
  Dialog,
  Flex,
  IconButton,
  Text,
} from '@radix-ui/themes';
import { getAuth } from 'firebase/auth';
import { trace } from 'firebase/performance';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import ErrorScaffold from '../error';

export default function TutorsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const t = trace(perf, 'fetch Tutors');
      t.start();
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { order_by: 'assistant.created_at' };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(`${url}v1/tutors?${queryString}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch personal tutors');
        }

        setData(data);
      } catch (err) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
      t.stop();
    } else {
      router.push('/sign_in');
    }
  };

  // create tutor
  const createTutor = async (createData) => {
    const t = trace(perf, 'create Tutor');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/tutors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify(createData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail);
      }
      // If successful, refetch the data to reflect the changes
      toastMessage(
        toast,
        'Personal tutor created successfully',
        null,
        'success'
      );
      fetchTutors();
    } catch (err) {
      toastMessage(
        toast,
        'Failed to create personal tutor',
        err?.message,
        'error'
      );
    }
    t.stop();
  };

  // update tutor
  const updateTutor = async (assistantId, updatedData) => {
    const t = trace(perf, 'update Tutor');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/tutors/${assistantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail);
      }
      // If successful, refetch the data to reflect the changes
      toastMessage(
        toast,
        'Personal tutor updated successfully',
        null,
        'success'
      );
      fetchTutors();
    } catch (err) {
      toastMessage(
        toast,
        'Failed to update personal tutor',
        err?.message,
        'error'
      );
    }
    t.stop();
  };

  // delete tutor
  const deleteTutor = async (assistantId) => {
    const t = trace(perf, 'delete Tutor');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/tutors/${assistantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail);
      }
      // If successful, refetch the data to reflect the changes
      toastMessage(
        toast,
        'Personal tutor deleted successfully',
        null,
        'success'
      );
      fetchTutors();
    } catch (err) {
      toastMessage(
        toast,
        'Failed to delete personal tutor',
        err?.message,
        'error'
      );
    }
    t.stop();
  };

  const columns = [
    {
      header: 'Name',
      render: (item) => <Text>{item.assistant.name}</Text>,
    },
    {
      header: 'Model',
      render: (item) => <Text>{item.assistant.model}</Text>,
    },
    {
      header: 'Instruction',
      render: (item) => <Text>{item.assistant.instructions}</Text>,
    },
    {
      header: 'Created',
      render: (item) => (
        <Text>
          {new Date(item.assistant.created_at * 1000).toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }
          )}
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
        item={item.assistant}
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
    <ErrorBoundary FallbackComponent={<ErrorScaffold error={error} />}>
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
                Your personal tutors
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
          reset={fetchTutors}
          renderRowActions={renderRowActions}
        />
      </Container>
    </ErrorBoundary>
  );
}
