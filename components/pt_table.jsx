// app/components/pt_table.jsx
'use client';

import ErrorScaffold from '@/app/dashboard/error';
import { Progress } from '@chakra-ui/react';
import { Container, Flex, Table, Text } from '@radix-ui/themes';

export default function PtTable({ data, isLoading, error, reset, columns }) {
  if (isLoading) {
    return <Progress size='xs' isIndeterminate color='violet' />;
  }

  // sort data
  data?.sort((a, b) => {
    const timeA = new Date(a.created_at);
    const timeB = new Date(b.created_at);

    return timeB - timeA;
  });

  return (
    <Container ml='10' mr='10' mt='4'>
      {/* table */}

      <Table.Root variant='surface' mt='4'>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.key}>
                {column.header}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            // Check if error
            error ? (
              <Table.Row>
                <Table.Cell colSpan={5} align='center'>
                  <ErrorScaffold error={error} reset={reset} />
                </Table.Cell>
              </Table.Row>
            ) : // Check if data is empty

            !data || data?.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text align='center'>No data available</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((item) => (
                <Table.Row key={item.id}>
                  {columns.map((column) => (
                    <Table.Cell key={column.key}>
                      {column.render(item)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )
          }
        </Table.Body>
      </Table.Root>
    </Container>
  );
}
