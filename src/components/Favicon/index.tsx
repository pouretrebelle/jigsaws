import Head from 'next/head'

interface Props {
  accentColorRgb?: string
}

export const Favicon: React.FC<Props> = ({ accentColorRgb }) => {
  let faviconUrl = '/api/favicon.svg'
  if (accentColorRgb)
    faviconUrl += `?color=rgb(${accentColorRgb.replace(/ /g, '')})`

  return (
    <Head>
      <link rel="icon" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
      <link
        rel="mask-icon"
        href={faviconUrl}
        color={`rgb(${accentColorRgb})`}
      />
    </Head>
  )
}
