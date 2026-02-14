import ScreenLoader from '@/components/ScreenLoader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/providers/AuthProvider'
import type { TInputs } from '@/types/utils'
import { useEffect, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import AuthForm from './AuthForm'

const AuthPage = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'register'>()
	const { login, register: reg, loading } = useAuth()
	const {	reset } = useForm<TInputs>()

	const inputs = [
		{
			label: "Логін",
			errorMessage: "Логін повинен бути обов'язковим",
			type: 'login',
			placeholder: "Введіть ваш логін",
		},
		{
			label: 'Email',
			errorMessage: "Email повинен бути обов'язковим",
			type: 'email',
			placeholder: 'Введіть email',
		},
		{
			label: 'Пароль',
			errorMessage: "Пароль повинен бути обов'язковим",
			type: 'password',
			placeholder: 'Введіть пароль',
		},
	]

	const handleLogin: SubmitHandler<FieldValues> = (data) => {
		login({ login: data.login, password: data.password })
		reset()
	}

	const handleRegister: SubmitHandler<FieldValues> = (data) => {
		reg({ login: data.login, email: data.email, password: data.password })
		reset()
	}

	useEffect(() => {
		reset()
	}, [activeTab])

	if (loading) {
		return <ScreenLoader message='Завантаження' />
	}

	return (
		<div className='min-h-screen w-full flex justify-center items-center p-4'>
			<div className='auth-window rounded-xl flex flex-col md:grid md:grid-cols-2 shadow-md bg-white w-full max-w-4xl min-h-137.5'>
				{/* Ліва частина: Форми */}
				<div className='md:p-8 p-4 flex flex-col justify-center'>
					<div className='mb-6'>
						<h2 className='text-3xl font-bold text-slate-800'>Вітаємо!</h2>
						<p className='text-slate-500 mt-2'>Будь ласка, введіть ваші дані</p>
					</div>

					<Tabs
						defaultValue='login'
						className='w-full'>
						<TabsList className='grid w-full grid-cols-2 md:mb-6 mb-4 bg-slate-100 p-1'>
							<TabsTrigger
								onClick={() => setActiveTab('login')}
								value='login'
								className='rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'>
								Логін
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setActiveTab('register')}
								value='register'
								className='rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'>
								Реєстрація
							</TabsTrigger>
						</TabsList>

						{/* Спільна логіка для обох табів */}
						{['login', 'register'].map((tab) => (
							<TabsContent
								key={tab}
								value={tab}
								className='mt-0 outline-none'>
								<AuthForm tab={tab} inputs={tab === 'login' ? inputs.filter(el => el.type !== 'email') : inputs} handler={tab === 'login' ? handleLogin : handleRegister}/>
							</TabsContent>
						))}
					</Tabs>
				</div>

				{/* Права частина: Брендинг */}
				<div className='hidden rounded-r-2xl md:flex relative bg-slate-900 overflow-hidden flex-col justify-center items-center p-12 text-center'>
					{/* Декоративні кола на фоні */}
					<div className='absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full -mr-32 -mt-32 blur-3xl'></div>
					<div className='absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl'></div>

					<div className='relative z-10 flex flex-col items-center'>
						<div className='bg-white/10 backdrop-blur-lg p-6 rounded-3xl mb-6 border border-white/10 shadow-2xl'>
							<img
								src='https://cdn.worldvectorlogo.com/logos/fastapi.svg'
								alt='FastAPI Logo'
								className='w-32 h-32 drop-shadow-[0_0_15px_rgba(5,153,139,0.5)]'
							/>
						</div>
						<h1 className='text-4xl font-black text-white tracking-tight mb-4'>
							FastAPI <span className='text-emerald-400'>Auth</span>
						</h1>
						<p className='text-slate-400 max-w-70 leading-relaxed'>
							Сучасна та безпечна система авторизації нового покоління
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthPage