import { createRouter, RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './providers/AuthProvider'
import { routeTree } from './routeTree.gen'
import { authService } from './services/auth.service'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createRouter({
	routeTree,
	context: {
		service: authService
	}
})

function RouterComponent() {
	return (
		<RouterProvider
			router={router}
			context={{ service: authService }}
		/>
	)
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<AuthProvider>
				<RouterComponent />
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
