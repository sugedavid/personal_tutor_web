// components/pt_modal.jsx

import {
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { useState } from 'react';

export default function PtTutorModal({
  title,
  subtitle,
  item,
  onSave,
  children,
}) {
  const [name, setName] = useState('');
  const [instruction, setInstruction] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  };

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
              defaultValue={item?.name}
              placeholder='Enter name'
              onChange={handleNameChange}
            />
          </label>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Model
            </Text>
            <TextField.Input
              disabled='true'
              defaultValue={item?.model || 'gpt-3.5-turbo-1106'}
              placeholder='Enter model'
            />
          </label>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Instruction
            </Text>
            <TextArea
              defaultValue={item?.instructions}
              placeholder='Enter instruction'
              onChange={handleInstructionChange}
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
            <Button
              onClick={() =>
                item?.id
                  ? onSave(item?.id, {
                      name: name,
                      instructions: instruction,
                      tools: [],
                    })
                  : onSave({
                      name: name,
                      instructions: instruction,
                      tools: [],
                    })
              }
            >
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
