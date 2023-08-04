import { useState, useEffect } from 'react';
import Notification from '@/components/ui/notification';
import { getNotification } from './config';
import classes from './index.module.css';

async function sendContactData(postData) {
	const res = await fetch('/api/contact', {
		method: 'POST',
		body: JSON.stringify(postData),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || 'Something went wrong!');
	}
}

export default function ContactForm() {
	const [enteredEmail, setEnteredEmail] = useState('');
	const [enteredName, setEnteredName] = useState('');
	const [enteredMessage, setEnteredMessage] = useState('');
	const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
	const [requestError, setRequestError] = useState();

	useEffect(() => {
		if (requestStatus === 'success' || requestStatus === 'error') {
			const timer = setTimeout(() => {
				setRequestStatus(null);
				setRequestError(null);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [requestStatus]);

	async function sendMessageHandler(event) {
		event.preventDefault();

		setRequestStatus('pending');

		try {
			await sendContactData({
				email: enteredEmail,
				name: enteredName,
				message: enteredMessage,
			});
			setRequestStatus('success');
			setEnteredMessage('');
			setEnteredEmail('');
			setEnteredName('');
		} catch (e) {
			setRequestError(e.message);
			setRequestStatus('error');
		}
	}

	const notification = getNotification(requestStatus, requestError);

	return (
		<section className={classes.contact}>
			<h1>How cna I help you?</h1>
			<form
				className={classes.form}
				onSubmit={sendMessageHandler}
			>
				<div className={classes.controls}>
					<div className={classes.control}>
						<label htmlFor='email'>Your Email</label>
						<input
							type='email'
							id='email'
							required
							value={enteredEmail}
							onChange={event => setEnteredEmail(event.target.value)}
						/>
					</div>
					<div className={classes.control}>
						<label htmlFor='name'>Your Name</label>
						<input
							type='text'
							id='name'
							required
							value={enteredName}
							onChange={event => setEnteredName(event.target.value)}
						/>
					</div>
				</div>
				<div className={classes.control}>
					<label htmlFor='message'>Your Message</label>
					<textarea
						id='message'
						rows='5'
						required
						value={enteredMessage}
						onChange={event => setEnteredMessage(event.target.value)}
					/>
				</div>

				<div className={classes.actions}>
					<button>Send Message</button>
				</div>
			</form>
			{notification && (
				<Notification
					status={notification.status}
					title={notification.title}
					message={notification.message}
				/>
			)}
		</section>
	);
}
