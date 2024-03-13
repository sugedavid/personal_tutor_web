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

export default function PtTable() {
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
            <Table.ColumnHeaderCell>Created by</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Flex gap='2'>
                <Text>Cloud Computing</Text>
                <Badge variant='soft'>Selected</Badge>
              </Flex>
            </Table.Cell>
            <Table.Cell>gpt 3.5</Table.Cell>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>18/03/2024</Table.Cell>
            <Table.Cell>
              <Flex gap='3'>
                {/* edit */}
                <PtModal title={'Edit Tutor'} subtitle={'Edit tutor details.'}>
                  <Dialog.Trigger>
                    <IconButton variant='soft'>
                      <FiEdit />
                    </IconButton>
                  </Dialog.Trigger>
                </PtModal>

                {/* delete */}
                <PtAlertDialog
                  title={'Delete Tutor'}
                  description={'Are you sure? This action cannot be undone.'}
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

          <Table.Row>
            <Table.RowHeaderCell>Cloud Computing</Table.RowHeaderCell>
            <Table.Cell>gpt 3.5</Table.Cell>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>18/03/2024</Table.Cell>
            <Table.Cell>
              <Flex gap='3'>
                {/* edit */}
                <PtModal title={'Edit Tutor'} subtitle={'Edit tutor details.'}>
                  <Dialog.Trigger>
                    <IconButton variant='soft'>
                      <FiEdit />
                    </IconButton>
                  </Dialog.Trigger>
                </PtModal>

                {/* delete */}
                <PtAlertDialog
                  title={'Delete Tutor'}
                  description={'Are you sure? This action cannot be undone.'}
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
        </Table.Body>
      </Table.Root>
    </Container>
  );
}
