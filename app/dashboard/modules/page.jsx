// app/dashboard/tutors/page.jsx
'use client';

import PtAlertDialog from '@/components/pt_alert_dialog';
import PtModuleModal from '@/components/pt_module_modal';
import PtTable from '@/components/pt_table';
import { toastMessage } from '@/components/pt_toast';
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

export default function ModulesPage() {
  const [data, setData] = useState(null);
  const [tutors, setTutors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  const url = 'http://127.0.0.1:8000/';

  useEffect(() => {
    fetchModules();
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
          throw new Error(data?.detail ?? 'Failed to fetch tutors');
        }

        setTutors(data);
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

  // fetch modules
  const fetchModules = async () => {
    if (user !== null) {
      const t = trace(perf, 'fetch Modules');
      t.start();
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { order_by: 'created_at' };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(`${url}v1/modules?${queryString}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch data');
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

  // create module
  const createModule = async (createData) => {
    const t = trace(perf, 'create Module');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/modules`, {
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
      toastMessage(toast, 'Module created successfully', null, 'success');
      fetchModules();
    } catch (err) {
      toastMessage(toast, 'Failed to create module', err?.message, 'error');
    }
    t.stop();
  };

  // update module
  const updateModule = async (assistantId, updatedData) => {
    const t = trace(perf, 'update Module');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/modules/${assistantId}`, {
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
      toastMessage(toast, 'Module updated successfully', null, 'success');
      fetchModules();
    } catch (err) {
      toastMessage(toast, 'Failed to update module', err?.message, 'error');
    }
    t.stop();
  };

  // delete module
  const deleteModule = async (assistantId) => {
    const t = trace(perf, 'delete Module');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/modules/${assistantId}`, {
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
      toastMessage(toast, 'Module deleted successfully', null, 'success');
      fetchModules();
    } catch (err) {
      toastMessage(toast, 'Failed to delete module', err?.message, 'error');
    }
    t.stop();
  };

  const columns = [
    {
      header: 'Name',
      render: (item) => <Text>{item.name}</Text>,
    },
    {
      header: 'Tutor',
      render: (item) => <Text>{item.assistant.name}</Text>,
    },
    {
      header: 'Created',
      render: (item) => (
        <Text>
          {new Date(item.created_at * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
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
      <PtModuleModal
        title={'Edit Personal Tutor'}
        subtitle={'Personal tutor details'}
        item={item}
        tutors={tutors}
        onSave={updateModule}
      >
        <Dialog.Trigger>
          <IconButton variant='soft'>
            <FiEdit />
          </IconButton>
        </Dialog.Trigger>
      </PtModuleModal>

      <PtAlertDialog
        title={'Delete Module'}
        description={
          <>
            Are you sure you want to delete <strong>{item.name}</strong>? This
            action cannot be undone.
          </>
        }
        buttonTitle={'Delete'}
        onSubmit={() => deleteModule(item.id)}
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
        <PtModuleModal
          title={`Create Module`}
          subtitle={`Module details`}
          tutors={tutors}
          onSave={createModule}
        >
          <Flex justify='between'>
            {/* title */}
            <Flex direction='column'>
              <Text size='4' as='b'>
                Modules
              </Text>
              <Text color='gray' size='2'>
                Your modules
              </Text>
            </Flex>

            {/* dialog cta */}
            <Dialog.Trigger>
              <Button>
                <FiPlus width='16' height='16' /> Create
              </Button>
            </Dialog.Trigger>
          </Flex>
        </PtModuleModal>

        <PtTable
          data={data}
          isLoading={isLoading}
          error={error}
          reset={fetchModules}
          columns={columns}
          renderRowActions={renderRowActions}
        />
      </Container>
    </ErrorBoundary>
  );
}
