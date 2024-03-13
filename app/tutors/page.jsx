// app/tutors/pages.jsx
'use client';

import React from 'react';
import MainScaffold from '@/components/main_scaffold';
import PtTable from '@/components/pt_table';

export default function TutorsPage() {
  return (
    <MainScaffold>
      <PtTable />
    </MainScaffold>
  );
}
