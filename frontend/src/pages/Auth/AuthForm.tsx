import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/AuthProvider'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'

function AuthForm({tab, handler, inputs}: {
	tab: string,
	handler: SubmitHandler<FieldValues>, 
	inputs: {
		label: string
		errorMessage: string
		type: string
		placeholder: string
	}[]
	}) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const { loading } = useAuth()

	return (
		<form
			className='space-y-5'
			onSubmit={handleSubmit(handler)}>
			{inputs.map(input => (
				<div
				key={input.type}
				className='space-y-1.5'>
				<label className='text-sm font-medium text-slate-700 ml-1'>{input.label}</label>
				<div className='relative'>
					<Input
						{...register(input.type, {
							required: input.errorMessage,
						})}
						className='h-11 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all pl-4 text-black'
						type={input.type === 'password' ? 'password' : 'text'}
						placeholder={input.placeholder}
					/>
				</div>
				{errors[input.type] && (
					<p className='text-red-500 text-xs mt-1 ml-1 animate-pulse'>{input.errorMessage}</p>
				)}
			</div>
			))}
			<Button
				type='submit'
				disabled={loading}
				className='w-full h-11 text-white font-semibold rounded-lg shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]'>
				{tab === 'login' ? 'Увійти до аккаунту' : 'Створити профіль'}
			</Button>
		</form>
	)
}

export default AuthForm