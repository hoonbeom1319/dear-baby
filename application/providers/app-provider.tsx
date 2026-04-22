import Container from '@/hbds/layout/container';

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return <Container variant="mobile">{children}</Container>;
}
