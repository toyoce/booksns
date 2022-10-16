import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import PropTypes from 'prop-types';
import * as React from 'react';
import { createContext, useState } from 'react';
import { Header } from '../components/Header';
import createEmotionCache from '../src/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();
export const UserContext = createContext();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [currentUser, setCurrentUser] = useState({"userId": undefined});

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Header />
        <Component {...pageProps} />
      </UserContext.Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};