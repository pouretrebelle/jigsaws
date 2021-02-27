import { useRouter } from 'next/router'
import Head from 'next/head'

import { buildCloudinaryImageUrl } from 'components/CloudinaryImage'

interface Props {
  title?: string
  description?: string
  imagePath: string
  smallImage?: boolean
}

export const SEO: React.FC<Props> = ({
  title,
  description,
  imagePath,
  smallImage,
}) => {
  const router = useRouter()

  const fullTitle = `${title ? `${title} • ` : ''}Abstract Puzzles`
  const fullDescription =
    description ||
    'Abstract puzzles is an experimental generative art project by Charlotte Dann exploring jigsaw design through creative coding. One new puzzle every week.'
  const imageUrl = buildCloudinaryImageUrl(imagePath || '', {
    w: 1200,
    h: smallImage ? 1200 : 630,
    c: 'fill',
  })

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />

      <meta
        property="og:url"
        content={`https://${process.env.NEXT_PUBLIC_URL || 'example.com'}${router.asPath}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />

      <meta
        name="twitter:card"
        content={smallImage ? 'summary' : 'summary_large_image'}
      />
      <meta name="twitter:site" content="@abstractpuzzles" />
      <meta name="twitter:creator" content="@charlotte_dann" />
    </Head>
  )
}
