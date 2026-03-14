import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SubscribeModal from '../components/modal/SubcriberModal'



export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <SubscribeModal />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
