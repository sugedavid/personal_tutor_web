// components/pt_modal.jsx

import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function PtModuleModal({
  title,
  subtitle,
  item,
  tutors,
  onSave,
  children,
}) {
  const [name, setName] = useState(item?.name);
  const [tutor, setTutor] = useState(item?.assistant);

  const handleNameChange = (event) => {
    setName(event.target.value);
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
              Tutor
            </Text>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant='soft'>
                  {!tutor ? 'Select tutor' : tutor.name}
                  <FiChevronDown />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {tutors?.map((item) => (
                  <DropdownMenu.Item
                    key={item.id}
                    onSelect={() => setTutor(item)}
                  >
                    {item.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
              disabled={!name || !tutor}
              onClick={() =>
                item?.id
                  ? onSave(item?.id, {
                      name: name,
                      assistant_id: tutor.id,
                    })
                  : onSave({
                      name: name,
                      assistant_id: tutor.id,
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
