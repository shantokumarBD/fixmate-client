'use client'
import { PageHeading } from '@/components/shared/PageHeading'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'


const page = () => {

   

  return (
    <div className='px-10'>
      <PageHeading title="Fixmate" description="Fixmate is a platform for finding and booking technicians for various home services." />

      <div>
        <EmptyState />
        <ConfirmDialog 
        isOpen={true}
        onClose={() => { }}
        onConfirm={() => { }}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        badge="CONFIRM ACTION"
        confirmText="Confirm"
        cancelText="Cancel"
        variant="danger"
        isLoading={false}

        ></ConfirmDialog>
      </div>
    </div>
  )
}

export default page