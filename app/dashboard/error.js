'use client';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
        We&apos;re sorry, something went wrong. Please try again later.
      </Text>
      <Box mt='3' size='3' align='center'>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </Box>
    </Flex>
  );
}
