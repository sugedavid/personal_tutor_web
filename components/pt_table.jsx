// app/components/pt_table.jsx
import { Progress } from '@chakra-ui/react';
import { Container, Flex, Table, Text } from '@radix-ui/themes';

export default function PtTable({ data, isLoading, error, columns }) {
  if (isLoading) {
    return <Progress size='xs' isIndeterminate color='violet' />;
  }

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
                  <Text align='center'>
                    Something went wrong. Please try again later.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : // Check if data is empty

            !data || data?.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={2}>
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
