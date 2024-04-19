// components/pt_modal.jsx
'use client';

import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';

export default function PtCreditModal({ title, subtitle, onSave, children }) {
  const [amount, setAmount] = useState();

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
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
              Amount
            </Text>
            <TextField.Input
              type='number'
              placeholder='Enter amount'
              onChange={handleAmountChange}
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
              disabled={!amount}
              onClick={() =>
                onSave({
                  amount: amount,
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
