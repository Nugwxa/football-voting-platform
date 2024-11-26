'use server'

import { GlobeIcon, MailIcon } from 'lucide-react'
import Button from '../Button'
import ContentWrapper from '../ContentWrapper'
import Link from 'next/link'
import style from './Footer.module.css'

export default async function Footer() {
  return (
    <ContentWrapper className={style.footerWrapper}>
      <footer className={style.footerContainer}>
        <div className={style.footerSocialLinks}>
          <Button
            style={{ color: 'inherit' }}
            icon={<GlobeIcon />}
            aria-label="View The Team Website"
            as={Link}
            mode="transparent"
            href={'#'}
          >
            <></>
          </Button>

          <Button
            style={{ color: 'inherit' }}
            icon={<MailIcon />}
            aria-label="Send An Email To Us"
            as={Link}
            mode="transparent"
            href={'#'}
          >
            <></>
          </Button>
        </div>
        <div className={style.footerNotice}>
          Built By{' '}
          <Link
            className={style.nameScribble}
            href={'https://nugwxa.vercel.app/'}
            target="_blank"
          >
            OJ Abba
          </Link>
        </div>
      </footer>
    </ContentWrapper>
  )
}
