import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from './auth-form.module.css';

async function createUser(email, password) {
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Something went wrong!');
	}

	return data;
}

function AuthForm() {
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const [isloading, setIsLoading] = useState(false);

	const [isLogin, setIsLogin] = useState(true);
	const router = useRouter();

	function switchAuthModeHandler() {
		setIsLogin(prevState => !prevState);
	}

	async function submitHandler(event) {
		event.preventDefault();

		setIsLoading(true);

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;

		// optional: Add validation

		if (isLogin) {
			try {
				const result = await signIn('credentials', {
					redirect: false,
					email: enteredEmail,
					password: enteredPassword,
				});

				if (!result.ok || result.error) {
					throw new Error(result.error);
				}
				// set some auth state
				router.replace('/profile');
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		} else {
			try {
				await createUser(enteredEmail, enteredPassword);
				emailInputRef.current.value = '';
				passwordInputRef.current.value = '';
				switchAuthModeHandler();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input
						type="email"
						id="email"
						required
						ref={emailInputRef}
					/>
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input
						type="password"
						id="password"
						required
						ref={passwordInputRef}
					/>
				</div>
				<div className={classes.actions}>
					<button disabled={isloading}>{isLogin ? 'Login' : 'Create Account'}</button>
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
