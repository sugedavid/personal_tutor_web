'use client';

import { Box, Button, Flex, Text } from '@radix-ui/themes';

export default function ErrorScaffold({ error, reset }) {
  console.log(error);

  return (
    <Flex
      direction='column'
      mt={20}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Text size='4' weight='bold' as='h2' align='center'>
        Something went wrong!
      </Text>
      <Text align='center' color='gray'>
        {error}
      </Text>
      <Box mt='3' size='3' align='center'>
        <Button onClick={() => reset()}>Try again</Button>
      </Box>
    </Flex>
  );
}
