export const toastMessage = (toast, title, description, status) => {
  toast({
    title: title,
    description: description,
    status: status,
    duration: 3000,
    isClosable: true,
  });
};
