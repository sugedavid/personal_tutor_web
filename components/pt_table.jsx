// app/components/pt_table.jsx
import { Progress } from '@chakra-ui/react';
import {
  AlertDialog,
  Button,
  Container,
  Dialog,
  Flex,
  IconButton,
  Table,
  Text,
} from '@radix-ui/themes';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import PtAlertDialog from './pt_alert_dialog';
import PtTutorModal from './pt_tutor_modal';

export default function PtTable({
  data,
  isLoading,
  error,
  onCreate,
  onUpdate,
  onDelete,
}) {
  if (isLoading) {
    return <Progress size='xs' isIndeterminate color='violet' />;
  }

  return (
    <Container ml='10' mr='10' mt='4'>
      {/* modal */}
      <PtTutorModal
        title={'Create Personal Tutor'}
        subtitle={'Personal tutor details'}
        onSave={onCreate}
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

      {/* table */}

      <Table.Root variant='surface' mt='4'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Model</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Instruction</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            // Check if error
            error ? (
              <Table.Row>
                <Table.Cell colSpan={5} align='center'>
                  <Text align='center'>
                    Something went wrong. Please try again later.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : // Check if data is empty
            data?.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={2}>No data available</Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Flex gap='2'>
                      <Text>{item.name}</Text>
                      {/* <Badge variant='soft'>{item.status}</Badge> */}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{item.model}</Table.Cell>
                  <Table.Cell width={400}>{item.instructions}</Table.Cell>
                  <Table.Cell>
                    {' '}
                    {new Date(item.created_at * 1000).toLocaleDateString(
                      'en-GB',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap='3'>
                      {/* edit */}
                      <PtTutorModal
                        title={'Edit Personal Tutor'}
                        subtitle={'Personal tutor details'}
                        item={item}
                        onSave={onUpdate}
                      >
                        <Dialog.Trigger>
                          <IconButton variant='soft'>
                            <FiEdit />
                          </IconButton>
                        </Dialog.Trigger>
                      </PtTutorModal>

                      {/* delete */}
                      <PtAlertDialog
                        title={'Delete Personal Tutor'}
                        description={
                          <>
                            Are you sure you want to delete{' '}
                            <strong>{item.name}</strong>? This action cannot be
                            undone.
                          </>
                        }
                        buttonTitle={'Delete'}
                        onSubmit={() => onDelete(item.id)}
                      >
                        <AlertDialog.Trigger>
                          <IconButton variant='soft' color='red'>
                            <FiTrash />
                          </IconButton>
                        </AlertDialog.Trigger>
                      </PtAlertDialog>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )
          }
        </Table.Body>
      </Table.Root>
    </Container>
  );
}
