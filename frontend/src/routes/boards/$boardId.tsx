import { createFileRoute, redirect } from '@tanstack/react-router'
import BoardDetail from '@/pages/Board/BoardDetail'

export const Route = createFileRoute('/boards/$boardId')({
  beforeLoad: async ({context}) => {
    const user = await context.service.me()
      if (!user) {
        throw redirect({
          to: '/',
          replace: true
        })
      }
  },
  component: BoardDetail,
})
