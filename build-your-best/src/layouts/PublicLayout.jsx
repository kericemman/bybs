import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SubscribeModal from '../components/modal/SubcriberModal'



export default function PublicLayout() {
  const location = useLocation()
  const isArticleDetail = /^\/articles\/[^/]+/.test(location.pathname)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <SubscribeModal showOnArticles={isArticleDetail} />
      <main className="overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
