'use client';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Heading,
  useColorModeValue,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Button, IconButton, Text, Link } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    toast({
      title: 'Registered in successfully.',
      status: 'success',
      duration: 9000,
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
            <HStack>
              {/* first name */}
              <Box>
                <FormControl id='firstName' isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type='text' />
                </FormControl>
              </Box>

              {/* last name */}
              <Box>
                <FormControl id='lastName'>
                  <FormLabel>Last Name</FormLabel>
                  <Input type='text' />
                </FormControl>
              </Box>
            </HStack>

            {/* email */}
            <FormControl id='email' isRequired isInvalid={errors?.email}>
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
            <FormControl id='password' isRequired isInvalid={errors?.password}>
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
                    variant={'ghost'}
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
              <Button
                loadingText='Submitting'
                size='3'
                onClick={handleSubmit(onSubmit)}
              >
                Continue
              </Button>
            </Stack>

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
