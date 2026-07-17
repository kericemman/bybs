import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SubscribeModal from '../components/modal/SubcriberModal'
import SEO from '../components/SEO'
import { absoluteUrl, breadcrumbSchema, getSeoForPathname } from '../lib/seo'



export default function PublicLayout() {
  const location = useLocation()
  const isArticleDetail = /^\/articles\/[^/]+/.test(location.pathname)
  const routeSeo = getSeoForPathname(location.pathname)
  const canonicalPath = location.pathname === '/' ? '/' : location.pathname

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        {...routeSeo}
        canonical={absoluteUrl(canonicalPath)}
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          ...(location.pathname === '/'
            ? []
            : [{ name: routeSeo.title?.split('|')[0]?.trim() || 'Page', path: canonicalPath }]),
        ])}
      />
      <Navbar />
      <SubscribeModal showOnArticles={isArticleDetail} />
      <main className={isArticleDetail ? undefined : 'overflow-x-hidden'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
