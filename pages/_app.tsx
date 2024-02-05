import type { AppProps } from "next/app";
import Head from "next/head";

import 'bootstrap/dist/css/bootstrap.css'



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Karaokê Ilhabela</title>
        <meta name="description" content="Aplicativo Web de Karaokê" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icons/icon.png" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="Karaokê Ilhabela" />
        <meta name="twitter:description" content="Aplicativo Web de Karaokê" />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My awesome PWA app" />
        <meta property="og:description" content="Aplicativo Web de Karaokê" />
        <meta property="og:site_name" content="Karaokê Ilhabela" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/icons/icon.png" />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon.png"
          sizes="640x1136"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}