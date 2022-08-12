import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import '../styles/global.scss'
import { SessionProvider } from 'next-auth/react'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import Link from 'next/link'
import { linkResolver, repositoryName } from '../services/prismic'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>
            {children}
          </a>
        </Link>
      )}
    >
      <SessionProvider session={pageProps.session}>
        <PrismicPreview repositoryName={repositoryName}>
          <Header />
          <Component {...pageProps} />
        </PrismicPreview>
      </SessionProvider>
    </PrismicProvider>
  )
}

export default MyApp
