import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import ScreenLoader from './components/ScreenLoader'
import { useCheckAuth } from './hooks/queries/useAuth'
import { authService } from './services/auth.service'

const router = createRouter({
	routeTree,
	context: {
		user: null,
		service: authService
	}
})

function App() {
	const {data: user, isLoading} = useCheckAuth()

	if (isLoading)  {
		return <ScreenLoader/>
	}

	return (
		<RouterProvider
			router={router}
			context={{ user }}
		/>
	)
}

export default App

// TODO Сделать возможность перетаскивать карточки по колонкам