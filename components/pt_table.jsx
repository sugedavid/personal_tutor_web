// app/components/pt_table.jsx
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import PtModal from './pt_modal';
import {
  Table,
  Flex,
  Badge,
  Button,
  IconButton,
  Text,
  Container,
  Dialog,
  AlertDialog,
} from '@radix-ui/themes';
import PtAlertDialog from './pt_alert_dialog';

export default function PtTable({ data }) {
  return (
    <Container ml='10' mr='10' mt='4'>
      {/* modal */}
      <PtModal title={'Create Tutor'} subtitle={'Create a new tutor.'}>
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
      </PtModal>

      {/* table */}
      <Table.Root variant='surface' mt='4'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Model</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Instruction</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            // Check if data is empty
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
                      <PtModal
                        title={'Edit Personal Tutor'}
                        subtitle={'Personal Tutor details.'}
                        item={item}
                      >
                        <Dialog.Trigger>
                          <IconButton variant='soft'>
                            <FiEdit />
                          </IconButton>
                        </Dialog.Trigger>
                      </PtModal>

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
