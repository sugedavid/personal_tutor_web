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
import PtModuleModal from '@/components/pt_module_modal';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import PtAlertDialog from '@/components/pt_alert_dialog';

export default function ModulesPage() {
  const [data, setData] = useState(null);
  const [tutors, setTutors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

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
        setTutors(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      router.push('/sign_in');
    }
  };

  // fetch modules
  const fetchModules = async () => {
    if (user !== null) {
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { token: idToken };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(`${url}v1/modules?${queryString}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      router.push('/sign_in');
    }
  };

  // create module
  const createModule = async (createData) => {
    try {
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(`${url}v1/modules?${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        throw new Error('Failed to create module');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Module create successfully', 'success');
      fetchModules();
    } catch (err) {
      toastMessage('Failed to create module', 'error');
      setUpdateError(err);
    }
  };

  // update module
  const updateModule = async (assistantId, updatedData) => {
    try {
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(
        `${url}v1/modules/${assistantId}?${queryString}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update module');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Module updated successfully', 'success');
      fetchModules();
    } catch (err) {
      toastMessage('Failed to update module', 'error');
      setUpdateError(err);
    }
  };

  // delete module
  const deleteModule = async (assistantId) => {
    try {
      const idToken = await user.getIdToken();
      const query = { token: idToken };
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(
        `${url}v1/modules/${assistantId}?${queryString}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete module');
      }
      // If successful, refetch the data to reflect the changes
      toastMessage('Module deleted successfully', 'success');
      fetchModules();
    } catch (err) {
      toastMessage('Failed to delete module', 'error');
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
    <ErrorBoundary FallbackComponent={<Error />}>
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
                Your Modules
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
          columns={columns}
          renderRowActions={renderRowActions}
        />
      </Container>
    </ErrorBoundary>
  );
}
