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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AlertDialog } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import {
  FiBell,
  FiBook,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import PtAlertDialog from './pt_alert_dialog';

import firebase_app from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

const NavigationItems = [
  { name: 'Chats', icon: FiMessageSquare, path: '/dashboard/chats' },
  { name: 'Tutors', icon: FiUser, path: '/dashboard/tutors' },
  { name: 'Modules', icon: FiBook, path: '/dashboard/modules' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
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
      {/* <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} /> */}

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

  const handleNavigation = (path) => {
    if (path === '/sign_in') {
      signOut(auth)
        .then(() => {
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
        <Text fontSize='xl' fontWeight='bold'>
          Personal Tutor
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {/* nav items */}
      {NavigationItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.path}
          onClick={() => handleNavigation(link.path)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

// navigation item component
const NavItem = ({ icon, onClick, path, children, ...rest }) => {
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
                p='4'
                mx='4'
                borderRadius='lg'
                role='group'
                cursor='pointer'
                _hover={{
                  bg: 'blue.500',
                  color: 'white',
                }}
                // onClick={onClick}
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
            p='4'
            mx='4'
            borderRadius='lg'
            role='group'
            cursor='pointer'
            _hover={{
              bg: 'blue.500',
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
        <IconButton
          size='lg'
          variant='ghost'
          aria-label='open menu'
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition='all 0.3s'
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems='flex-start'
                  spacing='1px'
                  ml='2'
                >
                  <Text fontSize='sm'>Justina Clark</Text>
                  <Text fontSize='xs' color='gray.600'>
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={'white'}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem color={'red.500'}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
