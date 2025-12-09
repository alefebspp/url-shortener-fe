import ShortLinkForm from '@/components/short-link-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="w-full h-full flex justify-center items-center px-4 md:px-0">
      <ShortLinkForm />
    </div>
  )
}
