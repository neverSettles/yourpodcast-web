import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      </SessionProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
