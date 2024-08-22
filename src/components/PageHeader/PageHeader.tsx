import { NavLinkType } from '../NavLinks/NavItem/NavItem'
import ContentWrapper from '../ContentWrapper'
import NavLinks from '../NavLinks'
import style from './PageHeader.module.css'

interface PageHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string
  links?: NavLinkType[]
}

/**
 * Renders a header section with a title and optional navigation links.
 *
 * @param {string} title - The title text to be displayed in the header.
 * @param {NavLinkType[]} links - Optional array of nav links to be rendered in the header.
 */
export default async function PageHeader(props: Readonly<PageHeaderProps>) {
  const { title, links, ...rest } = props
  return (
    <ContentWrapper className={style.pageHeaderWrapper}>
      <section className={style.pageHeaderContainer} {...rest}>
        <div className={style.pageHeaderTitleSection}>
          <h1>{title}</h1>
        </div>

        <div className={style.pageHeaderLinkSection}>
          <NavLinks
            styling={{ base: style.baseLink, active: style.activeLink }}
            mode="transparent"
            isBold
            links={links ?? []}
          />
        </div>
      </section>
    </ContentWrapper>
  )
}
