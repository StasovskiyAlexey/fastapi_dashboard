import { createRouter, RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './providers/AuthProvider'
import { routeTree } from './routeTree.gen' // Дерево роутов(генерируется самостоятельно)
import { authService } from './services/auth.service'

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
		<AuthProvider>
			<RouterComponent />
		</AuthProvider>
	)
}

export default App
