import styles from './styles.module.scss'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { createClient } from '../../services/prismic'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string
}

interface PostsProps {
  posts: Post[],
  documents: Post[]
}

export default function Posts({ posts, documents }: PostsProps) {
  const { data: session } = useSession()

  const url = session?.activeSubscription ? `/posts/` : `/posts/preview/`

  return (
    <>
      <Head>
        <title> Posts | Ignews </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map(post => (
            <Link key={post.slug} href={`${url}${post.slug}`}>
              <a>
                <time> {post.updatedAt} </time>
                <strong> {post.title} </strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData })

  const documents = await client.getAllByType('my-publication-type', { // pegar todos pelo tipo criado do custom types
    pageSize: 100
  })

  //const documents = await client.getByID('YjPhyxEAACAAGfTZ') // pegar pelo id

  const posts = documents.map(post => ({
    slug: post?.uid,
    title: String(post?.data?.Title),
    excerpt: post?.data?.Content?.find(cont => cont?.type === "paragraph")?.text ?? '',
    updatedAt: new Date(post?.last_publication_date).toLocaleDateString('pt-br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }))
  return {
    props: { posts, documents },
  }
}