'use client';

import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AlertDialog, Badge } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import {
  FiBook,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiPieChart,
  FiUser,
} from 'react-icons/fi';
import PtAlertDialog from './pt_alert_dialog';

import firebase_app from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { setIndex } from '../lib/slices/mainScaffoldSlice';

const NavigationItems = [
  { name: 'Chats', icon: FiMessageSquare, path: '/dashboard/chats' },
  { name: 'Tutors', icon: FiUser, path: '/dashboard/tutors' },
  { name: 'Modules', icon: FiBook, path: '/dashboard/modules' },
  { name: 'Usage', icon: FiPieChart, path: '/dashboard/usage' },
  { name: 'Sign out', icon: FiLogOut, path: '/sign_in' },
];

export default function MainScaffold({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH='100vh' bg='white'>
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* mobile navigation */}
      <MobileNav onOpen={onOpen} />

      {/* children */}
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  );
}

// sidebar component
const SidebarContent = ({ onClose, ...rest }) => {
  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);

  const dispatch = useAppDispatch();

  const handleNavigation = (path, index) => {
    if (path === '/sign_in') {
      signOut(auth)
        .then(() => {
          dispatch(setIndex(0));
          toast({
            title: 'Signed out successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          router.push(path);
        })
        .catch((error) => {
          toast({
            title: 'Oops! Could not sign you out.',
            description: error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      dispatch(setIndex(index));
      router.push(path);
    }
  };

  return (
    <Box
      bg={'gray.100'}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      {/* logo */}
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='l' fontWeight='bold'>
          Personal Tutor
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {/* nav items */}
      {NavigationItems.map((link, index) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.path}
          index={index}
          onClick={() => handleNavigation(link.path, index)}
        >
          <Text fontSize={'sm'}>{link.name}</Text>
        </NavItem>
      ))}
    </Box>
  );
};

// navigation item component
const NavItem = ({ icon, onClick, path, index, children, ...rest }) => {
  const stateIndex = useAppSelector((state) => state.index.value);
  return (
    <>
      {path === '/sign_in' ? (
        <PtAlertDialog
          title={'Sign Out'}
          description={'Are you sure you want to sign out?'}
          buttonTitle={'Sign Out'}
          onSubmit={onClick}
        >
          <AlertDialog.Trigger>
            <Box>
              <Flex
                align='center'
                p='3'
                mx='4'
                borderRadius='lg'
                role='group'
                cursor='pointer'
                _hover={{
                  bg: 'purple.500',
                  color: 'white',
                }}
                {...rest}
              >
                {icon && (
                  <Icon
                    mr='4'
                    fontSize='16'
                    _groupHover={{
                      color: 'white',
                    }}
                    as={icon}
                  />
                )}
                {children}
              </Flex>
            </Box>
          </AlertDialog.Trigger>
        </PtAlertDialog>
      ) : (
        <Box
          as='a'
          href='#'
          style={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
          onClick={onClick}
        >
          <Flex
            align='center'
            p='3'
            mx='4'
            borderRadius='lg'
            role='group'
            cursor='pointer'
            mt={0.5}
            mb={0.5}
            bg={stateIndex === index ? 'purple.500' : 'transparent'}
            color={stateIndex === index ? 'white' : 'black'}
            _hover={{
              bg: 'purple.500',
              color: 'white',
            }}
            {...rest}
          >
            {icon && (
              <Icon
                mr='4'
                fontSize='16'
                _groupHover={{
                  color: 'white',
                }}
                as={icon}
              />
            )}
            {children}
          </Flex>
        </Box>
      )}
    </>
  );
};

// mobile navigation component
const MobileNav = ({ onOpen, ...rest }) => {
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height='20'
      alignItems='center'
      bg={'white'}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='outline'
        aria-label='open menu'
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize='xl'
        ml='8'
        fontWeight='bold'
      >
        Personal Tutor
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <HStack>
            <Avatar size='sm' name={user?.displayName ?? 'No Name'} />
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems='flex-start'
              spacing='1px'
              ml='2'
            >
              <Text fontSize='sm' fontWeight='bold'>
                {user?.displayName ?? 'No name'}
              </Text>
              <Badge size={'1'} variant='surface'>
                {user?.email}
              </Badge>
            </VStack>
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  );
};
