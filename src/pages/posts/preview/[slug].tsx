import { GetStaticProps, GetStaticPaths } from "next"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createClient } from '../../../services/prismic'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import styles from '../post.module.scss'
import Link from "next/link"
import { useEffect } from "react"

interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
 
  const {data:session} = useSession()
  const { push } = useRouter()


  useEffect(() => {
      if (session?.activeSubscription){
        push(`/posts/${post.slug}`)
      }
  }, [session])

  return (
    <>
      <Head> <title> {post.title} | Ignews </title></Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1> {post.title} </h1>
          <time>{post.updatedAt}</time>
          <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content }}></div>

          <div className={styles.continueReading}> 
            Wanna Continue Reading?
            <Link href="/">
              <a> Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => { // getStaticPaths é necessario para getStaticProps em rotas dinamicas

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback PODE RECEBER TRUE, FALSE OU 'BLOCKING'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const client = createClient()

  const document = await client.getByUID('my-publication-type', String(slug))


  const post = {
    slug,
    title: String(document?.data?.Title),
    content: RichText.asHtml(document?.data?.Content.splice(0, 3)),
    updatedAt: new Date(document?.last_publication_date).toLocaleDateString('pt-br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutes
  }

}