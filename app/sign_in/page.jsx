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
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Button, IconButton, Link, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import firebase_app from '@/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSignIn, setSignIn] = React.useState(false);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      // if user is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleForm = (formData) => {
    setSignIn(true);
    // sign in
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setSignIn(false);
        const idToken = await userCredential.user.getIdToken();
        toast({
          title: 'Signed in successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/dashboard');
      })
      .catch((error) => {
        setSignIn(false);
        const errorMessage = error.message;
        toast({
          title: 'Oops! Could not sign you in.',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign in
          </Heading>
        </Stack>

        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <form onSubmit={handleSubmit(handleForm)}>
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
              {/* sign in cta */}
              <Stack spacing={10} pt={2}>
                <Button type='submit' size={'3'} disabled={isSignIn}>
                  {isSignIn ? (
                    <Spinner color='purple.600' loading={false} />
                  ) : (
                    'Sign in'
                  )}
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
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
