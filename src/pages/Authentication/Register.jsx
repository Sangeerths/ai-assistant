import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService } from '../../services/auth'
import useAuth from '../../hooks/useAuth'
import './Register.css'

export default function Register() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [role, setRole] = useState('interviewee')
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const { signin } = useAuth()
	const navigate = useNavigate()

	const validate = () => {
		const e = {}
		if (!name) e.name = 'Name is required'
		if (!email) e.email = 'Email is required'
		else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
		if (!password) e.password = 'Password is required'
		else if (password.length < 6) e.password = 'Password must be at least 6 characters'
		if (!confirm) e.confirm = 'Please confirm your password'
		else if (password !== confirm) e.confirm = 'Passwords do not match'
		if (!role) e.role = 'Please select a role'
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSubmit = async (ev) => {
		ev.preventDefault()
		setMessage(null)
		if (!validate()) return
		setLoading(true)
		try {
			const res = await registerService({ name, email, password, role })
			if (!res.ok) {
				setMessage(res.error || 'Registration failed')
				return
			}
			// sign in in context and navigate
			signin({ token: res.token, user: res.user })
			if (res.user.role === 'interviewer') navigate('/interviewer/dashboard')
			else navigate('/interviewee/dashboard')
		} catch (err) {
			setMessage('Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="login-page">
			<div className="login-card" role="main" aria-labelledby="register-heading">
				<h1 id="register-heading">Create an account</h1>
				<p className="sub">Start using the AI Assistant — it's quick and free.</p>

				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label htmlFor="name">Full name</label>
					<input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Your full name"
						aria-invalid={errors.name ? 'true' : 'false'}
						aria-describedby={errors.name ? 'name-error' : undefined}
					/>
					{errors.name && <div className="error" id="name-error">{errors.name}</div>}

					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						aria-invalid={errors.email ? 'true' : 'false'}
						aria-describedby={errors.email ? 'email-error' : undefined}
					/>
					{errors.email && <div className="error" id="email-error">{errors.email}</div>}

					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Choose a password"
						aria-invalid={errors.password ? 'true' : 'false'}
						aria-describedby={errors.password ? 'password-error' : undefined}
					/>
					{errors.password && <div className="error" id="password-error">{errors.password}</div>}

					<label htmlFor="confirm">Confirm password</label>
					<input
						id="confirm"
						name="confirm"
						type="password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="Repeat your password"
						aria-invalid={errors.confirm ? 'true' : 'false'}
						aria-describedby={errors.confirm ? 'confirm-error' : undefined}
					/>
					{errors.confirm && <div className="error" id="confirm-error">{errors.confirm}</div>}

					<label className="role-label" id="role-label">I am a</label>
					<div className="role-group" role="radiogroup" aria-labelledby="role-label">
						<label className="role-option">
							<input
								type="radio"
								name="role"
								value="interviewer"
								checked={role === 'interviewer'}
								onChange={() => setRole('interviewer')}
							/>
							Interviewer
						</label>
						<label className="role-option">
							<input
								type="radio"
								name="role"
								value="interviewee"
								checked={role === 'interviewee'}
								onChange={() => setRole('interviewee')}
							/>
							Interviewee
						</label>
					</div>
					{errors.role && <div className="error" id="role-error">{errors.role}</div>}

					<div className="actions">
						<button className="btn primary" type="submit" disabled={loading}>
							{loading ? 'Creating...' : 'Create account'}
						</button>
					</div>
				</form>

				{message && <div className="message">{message}</div>}

						<div className="footer">
							<Link to="/login">Already have an account? Sign in</Link>
						</div>
			</div>
		</div>
	)
}

