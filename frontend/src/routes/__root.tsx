import ScreenLoader from '@/components/ScreenLoader'
import MainLayout from '@/layouts/MainLayout'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { type TAuthService } from '@/services/auth.service'

export interface MyRouterContext {
	service: TAuthService
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	pendingComponent: () => <ScreenLoader />,
	component: () => (
		<MainLayout>
			<Outlet />
		</MainLayout>
	),
})
