import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginService } from '../../services/auth'
import useAuth from '../../hooks/useAuth'
import './Login.css'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('interviewee')
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const { signin } = useAuth()
	const navigate = useNavigate()

	const validate = () => {
		const e = {}
		if (!email) e.email = 'Email is required'
		else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
		if (!password) e.password = 'Password is required'
		else if (password.length < 6) e.password = 'Password must be at least 6 characters'
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
			const res = await loginService({ email, password, role })
			if (!res.ok) {
				setMessage(res.error || 'Sign in failed')
				return
			}
			// persist in context
			signin({ token: res.token, user: res.user })
			// navigate according to role
			if (res.user.role === 'interviewer') navigate('/interviewer/dashboard')
			else navigate('/interviewee/dashboard')
		} catch (err) {
			setMessage('Sign in failed')
		} finally {
			setLoading(false)
		}
	}


	return (
		<div className="login-page">
			<div className="login-card" role="main" aria-labelledby="login-heading">
				<h1 id="login-heading">Sign in to AI Assistant</h1>
				<p className="sub">Enter your account details to continue</p>

				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						aria-invalid={errors.email ? 'true' : 'false'}
						aria-describedby={errors.email ? 'email-error' : undefined}
						placeholder="you@example.com"
					/>
					{errors.email && (
						<div className="error" id="email-error">
							{errors.email}
						</div>
					)}

					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						aria-invalid={errors.password ? 'true' : 'false'}
						aria-describedby={errors.password ? 'password-error' : undefined}
						placeholder="Your password"
					/>
					{errors.password && (
						<div className="error" id="password-error">
							{errors.password}
						</div>
					)}

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
							{loading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>

				{message && <div className="message">{message}</div>}

						<div className="footer">
							<a href="#">Forgot password?</a>
							<span className="sep">•</span>
							<Link to="/register">Create account</Link>
						</div>
			</div>
		</div>
	)
}
