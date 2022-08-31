import { ReactNode } from 'react';
import { AppShell, Header, Navbar, Box, Anchor } from '@mantine/core';
import Image from 'next/image';


function HomePageLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding='md'
      navbar={
        <Navbar width={{ base: 100 }} height={500} p='xs'>
          Side items
        </Navbar>
      }
      header={
        <Header height={60} p='xs'>
          <Box sx={() => ({ display: 'flex' })}>
            <Box sx={() => ({ flex: '1' })}>
              <Image
                src='/logo.png'
                alt='logo'
                width='100px'
                height='40px'
              />
            </Box>
          </Box>
        </Header>
      }>
      {children}
    </AppShell>
  );
}

export default HomePageLayout;
