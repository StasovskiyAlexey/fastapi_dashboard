import { authService } from '@/services/auth.service'
import type { TUser, TUserLogin, TUserRegister } from '@/types/user'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

export type TAuthContext = {
	login: ({ login, password }: TUserLogin) => void
	me: () => Promise<TUser | undefined>
	register: ({ login, email, password }: TUserRegister) => void
	logout: () => void
	loading: boolean
	user: TUser | null
	setUser: React.Dispatch<React.SetStateAction<TUser | null>>
}

const AuthContext = createContext<TAuthContext | null>(null)

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
	const [user, setUser] = useState<TUser | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const navigate = useNavigate()
	const router = useRouter()

	async function login({ login, password }: TUserLogin) {
		setLoading(true)
		try {
			const res = await authService.login({login, password})

			setUser(res.data)
			await router.invalidate()

			toast.success(res.message)
			console.log(res)

			navigate({ to: '/' })
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
		} finally {
			setLoading(false)
		}
	}

	async function me() {
		setLoading(true)
		try {
			const res = await authService.me()
			if (res?.data) {
				setUser(res.data)
			}
			console.log(res)
			return res?.data
		} catch (e) {
			console.log(e)
		} finally {
			setLoading(false)
		}
	}

	async function register({ login, email, password }: TUserRegister) {
		setLoading(true)
		try {
			const res = await authService.register({login, email, password})
			setUser(res.data)
			
			await router.invalidate()

			toast.success('Аккаунт успішно зареєстровано')
			navigate({ to: '/' })
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
		} finally {
			setLoading(false)
		}
	}

	async function logout() {
		setLoading(true)
		try {
			const res = await authService.logout()
			console.log(res)
			
			setUser(null)
			await router.invalidate()

			toast.success('Успішний вихід з аккаунту')
			navigate({ to: '/auth' })
			return res
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		me()
	}, [])

	return <AuthContext.Provider value={{ login, me, register, logout, loading, user, setUser }}>{children}</AuthContext.Provider>
}


export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('Error')
	}

	return context
}
