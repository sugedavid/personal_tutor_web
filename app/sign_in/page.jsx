'use client';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Button, IconButton, Text, Link } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  const onSubmit = ({ email, password }) => {
    toast({
      title: 'Signed in successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    router.push('/dashboard');
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
            Sign in
          </Heading>
        </Stack>

        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
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

            {/* sign in cta */}
            <Stack spacing={10} pt={2}>
              <Button
                type='submit'
                loadingText='Submitting'
                size={'3'}
                onClick={handleSubmit(onSubmit)}
              >
                Sign in
              </Button>
            </Stack>

            {/* new user */}
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account?{' '}
                <Link href='/sign_up' color={'blue.400'}>
                  Register
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
