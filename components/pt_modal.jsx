// components/pt_modal.jsx

import { Dialog, Flex, TextField, Text, Button } from '@radix-ui/themes';

export default function PtModal({ title, subtitle, children }) {
  return (
    <Dialog.Root>
      {children}

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size='2' mb='4'>
          {subtitle}
        </Dialog.Description>

        <Flex direction='column' gap='3'>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Name
            </Text>
            <TextField.Input
              defaultValue='Cloud Computing'
              placeholder='Enter name'
            />
          </label>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Model
            </Text>
            <TextField.Input
              disabled='true'
              defaultValue='gpt 3.5'
              placeholder='Enter your email'
            />
          </label>
        </Flex>

        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button variant='soft' color='gray'>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
