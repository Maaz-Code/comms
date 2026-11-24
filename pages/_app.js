import { ChakraProvider, Center, ClientOnly, Spinner, defaultSystem } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebaseconfig";
import Login from "../components/Login";
import Toasts from "../utils/toasters";
import '../styles/globals.scss';

function SessionLoading() {
  return (
    <Center minH="100dvh" role="status" aria-label="Checking your session">
      <Spinner size="xl" />
    </Center>
  );
}

function AuthenticatedPage({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <SessionLoading />;
  if (!user?.email) return <Login sessionError={error} />;

  return <Component key={user.uid} {...pageProps} user={user} />;
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ClientOnly fallback={<SessionLoading />}>
        <AuthenticatedPage Component={Component} pageProps={pageProps} />
        <Toasts />
      </ClientOnly>
    </ChakraProvider>
  )
}

export default MyApp
