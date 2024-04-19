'use client';

import { toastMessage } from '@/components/pt_toast';
import firebase_app from '@/firebase';
import { useAppDispatch } from '@/lib/hooks';
import { setIndex } from '@/lib/slices/mainScaffoldSlice';
import {
  Avatar,
  Box,
  Flex,
  Progress,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  Button,
  DropdownMenu,
  IconButton,
  ScrollArea,
  Text,
  TextField,
} from '@radix-ui/themes';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiSend } from 'react-icons/fi';
import ErrorScaffold from '../error';

export default function ChatsPage() {
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const [modules, setModules] = useState(null);
  const [module, setModule] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollAreaRef = useRef(null);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  const url = 'http://127.0.0.1:8000/';

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch modules
  const fetchModules = async () => {
    if (user !== null) {
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { order_by: 'created_at' };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(`${url}v1/modules?${queryString}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch modules');
        }

        setModules(data);
        setModule(data[0]);
        fetchMessages(data?.[0]);
      } catch (err) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      router.push('/sign_in');
    }
  };

  // fetch messages
  const fetchMessages = async (module) => {
    if (user !== null) {
      if (module?.thread_id) {
        setIsLoading(true);
        const idToken = await user.getIdToken();
        try {
          const query = {
            thread_id: module?.thread_id,
          };
          const queryString = new URLSearchParams(query).toString();
          const res = await fetch(`${url}v1/messages?${queryString}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + idToken,
            },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.detail ?? 'Failed to fetch messages');
          }

          setMessages(data?.data?.reverse());
        } catch (err) {
          setError(err?.message);
        } finally {
          setIsLoading(false);
          scrollToBottom();
        }
      }
    } else {
      router.push('/sign_in');
    }
  };

  // create message
  const createMessage = async () => {
    if (messageInput.trim() === '') return;
    try {
      const idToken = await user.getIdToken();

      const newMessage = {
        assistant_id: module?.assistant?.id,
        thread_id: module?.thread_id,
        content: messageInput,
        user_id: user?.uid,
        instructions: module?.assistant?.instructions,
      };

      const res = await fetch(`${url}v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail);
      }
      // If successful, refetch the data to reflect the changes
      setMessageInput('');
      delayedFetch();
    } catch (err) {
      toastMessage(toast, 'Failed to send message', err?.message, 'error');
      setError(err?.message);
    }
  };

  // delay the fetch to wait for response from the assistant
  function delayedFetch() {
    setIsMessageLoading(true);
    scrollToBottom();
    setTimeout(() => {
      setIsMessageLoading(false);
      fetchMessages(module);
    }, 5000);
  }

  // user pressed the enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      createMessage();
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // loading
  if (isLoading) {
    return <Progress size='xs' isIndeterminate color='violet' />;
  }

  // error
  if (error) {
    return (
      <Flex h='40vh' style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ErrorScaffold error={error} reset={fetchModules} />;
      </Flex>
    );
  }

  // empty state
  if (!modules || modules?.length === 0)
    return (
      <Flex
        h='40vh'
        direction='column'
        mt={20}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Text size='4' weight='bold' as='h2' align='center'>
          One more thing!
        </Text>
        <Text align='center' color='gray'>
          Create a module and tutor to start a conversation.
        </Text>
        <Flex mt='3' size='3' align='center' gap={2}>
          <Button
            variant='surface'
            onClick={() => {
              dispatch(setIndex(1));
              router.push('/dashboard/tutors');
            }}
          >
            Create Tutor
          </Button>

          <Button
            variant='surface'
            color='orange'
            onClick={() => {
              dispatch(setIndex(2));
              router.push('/dashboard/modules');
            }}
          >
            Create Module
          </Button>
        </Flex>
      </Flex>
    );

  return (
    <Box>
      <ScrollArea ref={scrollAreaRef}>
        <Flex direction='column' h='80vh' pl={20} pr={20}>
          {
            // empty messages
            !messages || messages?.length === 0 ? (
              <Flex
                h='40vh'
                direction='column'
                mt={20}
                style={{ justifyContent: 'center', alignItems: 'center' }}
              >
                <Text size='4' weight='bold' as='h2' align='center'>
                  No Chats
                </Text>
                <Text align='center' color='gray'>
                  Start a new conversation with your personal tutor.
                </Text>
              </Flex>
            ) : (
              // messages
              <VStack spacing={4} align='flex-start' p={4}>
                {messages?.map((message) => (
                  <Flex key={message.id} gap='3' align='top' mb={2} w='100%'>
                    <Avatar
                      size='sm'
                      name={
                        message?.role === 'user'
                          ? user?.displayName ?? 'No Name'
                          : module?.name
                      }
                    />
                    <Box w='100%'>
                      <Text as='div' size='2' weight='bold'>
                        {message?.role === 'user' ? 'You' : module?.name}
                      </Text>
                      <Text as='div' size='2' color='gray'>
                        {message?.content?.[0].text?.value}
                      </Text>
                      <Box h={2} />
                      <Text align={'right'} as='div' size='1' color='gray'>
                        {new Date(
                          message?.created_at * 1000
                        ).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Box>
                  </Flex>
                ))}

                {isMessageLoading && (
                  <Flex gap='3' align='top' mb={2}>
                    <Avatar size='sm' name={module?.name} />
                    <Box>
                      <Text as='div' size='2' weight='bold'>
                        {module?.name}
                      </Text>
                      <Text as='div' size='2' color='gray'>
                        Thinking...
                      </Text>
                      <Text as='div' size='1' color='gray'>
                        {new Date().toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Box>
                  </Flex>
                )}
              </VStack>
            )
          }
        </Flex>
      </ScrollArea>

      {/* chat input */}
      {module && (
        <Box pl={20} pr={20}>
          <TextField.Root>
            {/* assistant */}
            <TextField.Slot>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant='soft' size={'1'}>
                    {!module ? 'Select module' : module?.name}
                    <FiChevronDown />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {modules?.map((item) => (
                    <DropdownMenu.Item
                      key={item.id}
                      onSelect={() => {
                        setModule(item);
                        fetchMessages(item);
                      }}
                    >
                      {item.name}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </TextField.Slot>

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
                onClick={createMessage}
                aria-label='Send message'
              >
                <FiSend height='14' width='14' />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>
        </Box>
      )}
    </Box>
  );
}
