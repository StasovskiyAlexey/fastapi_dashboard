import Settings from '@/pages/Settings'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context }) => {
		const user = await context.service.me()
		if (!user) {
			throw redirect({
				to: '/auth',
				replace: true
			})
		}
	},
	component: Settings,
})
