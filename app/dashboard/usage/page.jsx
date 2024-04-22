// app/dashboard/tutors/page.jsx
'use client';

import PtBarChart from '@/components/pt_bart_chart';
import PtCreditModal from '@/components/pt_credit_modal';
import PtPieChart from '@/components/pt_pie_chart';
import PtTable from '@/components/pt_table';
import { toastMessage } from '@/components/pt_toast';
import firebase_app, { perf } from '@/firebase';
import { useToast } from '@chakra-ui/react';
import { Button, Container, Dialog, Flex, Text } from '@radix-ui/themes';
import { getAuth } from 'firebase/auth';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import ErrorScaffold from '../error';
import { trace } from 'firebase/performance';

export default function UsagePage() {
  const [data, setData] = useState(null);
  const [creditsSummary, setCreditsSummary] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);

  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const toast = useToast();

  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  const url = 'http://127.0.0.1:8000/';

  useEffect(() => {
    fetchUserInfo();
    fetchCredits();
    fetchCreditsSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch user info
  const fetchUserInfo = async () => {
    if (user !== null) {
      const t = trace(perf, 'fetch User');
      t.start();
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const res = await fetch(`${url}v1/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch user info');
        }

        setUserInfo(data);
      } catch (err) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
      t.stop();
    } else {
      router.push('/sign_in');
    }
  };

  // fetch credits
  const fetchCredits = async () => {
    if (user !== null) {
      const t = trace(perf, 'fetch Credits');
      t.start();
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const query = { order_by: 'created_at' };
        const queryString = new URLSearchParams(query).toString();
        const res = await fetch(`${url}v1/credits?${queryString}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch credits');
        }

        setData(data);
      } catch (err) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
      t.stop();
    } else {
      router.push('/sign_in');
    }
  };

  // fetch credits summary
  const fetchCreditsSummary = async () => {
    if (user !== null) {
      const t = trace(perf, 'fetch Credits Summary');
      t.start();
      setIsLoading(true);
      const idToken = await user.getIdToken();
      try {
        const res = await fetch(`${url}v1/credits-summary`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail ?? 'Failed to fetch credit summary');
        }

        // process data into format suitable for rendering in the BarChart
        const chartData = Object.entries(data)
          .filter(([type]) => type !== 'Top up')
          .map(([type, Amount]) => ({
            type,
            Amount,
          }));
        setCreditsSummary(chartData);

        // Create data array for the pie chart
        const pData = Object.entries(data)
          .filter(([type]) => type !== 'Top up')
          .map(([type, Amount]) => ({
            name: type,
            value: Amount,
          }));

        console.log(pData);
        setPieChartData(pData);
      } catch (err) {
        setError(err?.message);
      } finally {
        setIsLoading(false);
      }
      t.stop();
    } else {
      router.push('/sign_in');
    }
  };

  // add credit
  const addCredit = async (createData) => {
    const t = trace(perf, 'add Credit');
    t.start();
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${url}v1/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify(createData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail);
      }
      // If successful, refetch the data to reflect the changes
      toastMessage(toast, 'Credit added successfully', null, 'success');
      fetchUserInfo();
      fetchCredits();
      fetchCreditsSummary();
    } catch (err) {
      toastMessage(toast, 'Failed to add credit', err?.message, 'error');
    }
    t.stop();
  };

  const columns = [
    {
      header: 'Type',
      render: (item) => <Text>{item.type}</Text>,
    },
    {
      header: 'Amount',
      render: (item) => (
        <Flex align={'baseline'}>
          <Text size={'1'} color={item.type === 'Top up' ? 'green' : 'red'}>
            {item.type === 'Top up' ? '+' : '-'}
          </Text>
          <Text ml={'1'} color={item.type === 'Top up' ? 'green' : 'red'}>
            {item.currency}
            {item.amount}
          </Text>
        </Flex>
      ),
    },
    {
      header: 'Date',
      render: (item) => (
        <Text>
          {new Date(item.created_at * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      ),
    },
  ];

  return (
    <ErrorBoundary FallbackComponent={<ErrorScaffold error={error} />}>
      <Container>
        {/* create modal */}
        <PtCreditModal title={`Add Credit`} onSave={addCredit}>
          <Flex justify='between'>
            {/* title */}
            <Flex direction='column'>
              <Text size='4' as='b'>
                Usage
              </Text>
              <Text color='gray' size='2'>
                Your credit usage
              </Text>
            </Flex>

            {/* dialog cta */}
            <Dialog.Trigger>
              <Button>
                <FiPlus width='16' height='16' /> Add credit
              </Button>
            </Dialog.Trigger>
          </Flex>
        </PtCreditModal>

        {/* balance */}
        <Flex
          direction='column'
          gap={'1'}
          pt={'3'}
          align={'center'}
          justify={'center'}
          width={'100%'}
        >
          <Text color='gray' size='2'>
            Credit balance:
          </Text>
          <Text size='8' as='b'>
            {userInfo?.currency}
            {userInfo?.credits}
          </Text>
        </Flex>

        <Flex mb={'4'}>
          {/* bar chart */}
          <PtBarChart data={creditsSummary} />

          {/* pie chart */}
          <PtPieChart data={pieChartData} />
        </Flex>

        {/* table */}
        <Text color='gray' size='2'>
          Activity
        </Text>

        <PtTable
          data={data}
          isLoading={isLoading}
          error={error}
          reset={fetchCredits}
          columns={columns}
        />
      </Container>
    </ErrorBoundary>
  );
}
