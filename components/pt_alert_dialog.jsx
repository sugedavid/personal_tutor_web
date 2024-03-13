import { AlertDialog, Button, Flex } from '@radix-ui/themes';

export default function PtAlertDialog({
  title,
  description,
  buttonTitle,
  onSubmit,
  children,
}) {
  return (
    <AlertDialog.Root>
      {children}
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size='2'>
          {description}
        </AlertDialog.Description>

        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray'>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant='solid' color='red' onClick={onSubmit}>
              {buttonTitle || 'Continue'}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
