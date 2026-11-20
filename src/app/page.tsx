'use client'
import { PageHeading } from '@/components/shared/PageHeading'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'


const page = () => {

   

  return (
    <div className='px-10'>
      <Navbar></Navbar>
      <Footer></Footer>
    </div>
  )
}

export default page