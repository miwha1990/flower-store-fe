import { Divider, Stack } from '@mui/material';
import {
  Account,
  AccountPreview,
  SignOutButton,
  AccountPreviewProps,
} from '@toolpad/core/Account';
import { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { useMemo } from 'react';

function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean }) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
        slots={{ moreIconButton: () => <SignOutButton />, avatar: () => null }}
      />
    </Stack>
  );
}

const createPreviewComponent = (mini: boolean) => {
  function PreviewComponent(props: AccountPreviewProps) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

export function SidebarFooter({ mini }: SidebarFooterProps) {
  const PreviewComponent = useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
      }}
    />
  );
}
