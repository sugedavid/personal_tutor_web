'use client';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Button, IconButton, Link, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const url = 'http://127.0.0.1:8000/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // register user
  const handleForm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail ?? 'Registration failed');
      }
      setLoading(false);
      toastMessage(
        'Registered successfully',
        'Sign in with your new account',
        'success'
      );
      router.push('/sign_in');
    } catch (err) {
      setLoading(false);
      toastMessage('Registration failed', err?.message, 'error');
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toastMessage = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>

        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit(handleForm)}>
              <HStack>
                {/* first name */}
                <Box>
                  <FormControl
                    id='firstName'
                    isRequired
                    isInvalid={errors?.firstName}
                  >
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type='text'
                      name='firstName'
                      {...register('firstName', {
                        required: true,
                      })}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                  <FormErrorMessage>
                    {errors?.firstName?.message}
                  </FormErrorMessage>
                </Box>

                {/* last name */}
                <Box>
                  <FormControl
                    id='lastName'
                    isRequired
                    isInvalid={errors?.lastName}
                  >
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type='text'
                      name='lastName'
                      {...register('lastName', {
                        required: true,
                      })}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormControl>
                  <FormErrorMessage>
                    {errors?.lastName?.message}
                  </FormErrorMessage>
                </Box>
              </HStack>

              {/* email */}
              <FormControl
                id='email'
                isRequired
                isInvalid={errors?.email}
                w={400}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  name='email'
                  {...register('email', {
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>

              {/* password */}
              <FormControl
                id='password'
                isRequired
                isInvalid={errors?.password}
                w={400}
              >
                <FormLabel>Password</FormLabel>

                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    {...register('password', {
                      required: true,
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={'full'}>
                    <IconButton
                      variant='ghost'
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </IconButton>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>

              {/* sign up */}
              <Stack spacing={10} pt={2}>
                <Button size='3' disabled={loading}>
                  {loading ? (
                    <Spinner color='purple.600' loading={false} />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Stack>
            </form>

            {/* already a user */}
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <Link href='/sign_in' color={'blue.400'}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
