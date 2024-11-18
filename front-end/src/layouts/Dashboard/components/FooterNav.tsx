import { Layout } from 'antd'

const { Footer } = Layout

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>

const FooterNav = ({ ...others }: FooterNavProps) => {
  return <Footer {...others}>Findoc Manager by Uc Nguyen</Footer>
}

export default FooterNav
