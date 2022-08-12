import { GetServerSideProps } from "next"
import { getSession } from 'next-auth/react'
import { createClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
  console.log('poste', post)
  return (
    <>
      <Head> <title> {post.title} | Ignews </title></Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1> {post.title} </h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const { slug } = params

  if(!session?.activeSubscription){ // no next para redirecionar usando o getServerSideProps ou o getStaticProps, existe a propriedade redirect
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
   } 

  const client = createClient({ req })

  const document = await client.getByUID('my-publication-type', String(slug))

  console.log('document', session)

  const post = {
    slug,
    title: String(document?.data?.Title),
    content: RichText.asHtml(document?.data?.Content),
    updatedAt: new Date(document?.last_publication_date).toLocaleDateString('pt-br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }

}