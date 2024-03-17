'use client';

import { Flex, VStack, Box } from '@chakra-ui/react';
import {
  IconButton,
  ScrollArea,
  TextField,
  Text,
  Avatar,
} from '@radix-ui/themes';
import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

export default function ChatsPage() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const scrollAreaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleMessageSend();
    }
  };

  const handleMessageSend = () => {
    if (messageInput.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth', // Optional: You can use 'auto' for instant scroll
      });
    }
  };

  return (
    <Box>
      <ScrollArea ref={scrollAreaRef}>
        <Flex direction='column' h='80vh' pl={20} pr={20}>
          <VStack spacing={4} align='flex-start' p={4}>
            {messages.map((message) => (
              <Flex key={message.id} gap='3' align='center' mb={10}>
                <Avatar
                  size='3'
                  src='https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop'
                  radius='full'
                  fallback='T'
                />
                <Box>
                  <Text as='div' size='2' weight='bold'>
                    Teodros Girmay
                  </Text>
                  <Text as='div' size='2' color='gray'>
                    {message.text}
                  </Text>
                  <Text as='div' size='2' color='gray'>
                    {message.timestamp}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Flex>
      </ScrollArea>

      {/* chat input */}
      <Box pl={20} pr={20}>
        <TextField.Root>
          {/* message */}
          <TextField.Input
            size={'3'}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder='Enter message...'
            onKeyDown={handleKeyDown}
          />

          {/* send */}
          <TextField.Slot>
            <IconButton
              size='1'
              variant='ghost'
              onClick={handleMessageSend}
              aria-label='Send message'
            >
              <FiSend height='14' width='14' />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </Box>
    </Box>
  );
}
