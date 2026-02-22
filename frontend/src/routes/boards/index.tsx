import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboards from '@/pages/Boards/Boards'

export const Route = createFileRoute('/boards/')({
  beforeLoad: async ({context}) => {
    const user = await context.service.me()
      if (!user) {
        throw redirect({
          to: '/',
          replace: true
        })
      }
  },
  component: Dashboards,
})
