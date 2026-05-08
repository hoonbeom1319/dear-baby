'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Confirm } from '@/hbds/overlay/confirm/confirm';

const ErrorModal = () => (
    <>
        <Confirm name="error1"></Confirm>
        <Confirm name="error2"></Confirm>
        <Confirm name="error3"></Confirm>
        <Confirm name="error4"></Confirm>
        <Confirm name="alert1"></Confirm>
        <Confirm name="alert2"></Confirm>
        <Confirm name="alert3"></Confirm>
        <Confirm name="alert4"></Confirm>
        <Confirm name="alert5"></Confirm>
        <Confirm name="alert6"></Confirm>
        <Confirm name="alert7"></Confirm>
        <Confirm name="alert8"></Confirm>
        <Confirm name="alert9"></Confirm>
        <Confirm name="alert10"></Confirm>
    </>
);

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ErrorModal />
        </QueryClientProvider>
    );
}
