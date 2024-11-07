// pages/_app.js
import '../styles/globals.css'; 
import { SessionProvider } from "next-auth/react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
