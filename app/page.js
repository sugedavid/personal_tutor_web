// app/page.tsx
'use client';
import MainScaffold from '@/components/main_scaffold';
import ChatsPage from './dashboard/chats/page';

export default function Page() {
  return (
    <MainScaffold>
      <ChatsPage />
    </MainScaffold>
  );
}
