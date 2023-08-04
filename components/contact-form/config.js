export const getNotification = (type, errorMsg) =>
	({
		pending: {
			status: 'pending',
			title: 'Sending message...',
			message: 'Your message is on its way!',
		},
		success: {
			status: 'success',
			title: 'Success!',
			message: 'Message sent successfully!',
		},
		error: {
			status: 'error',
			title: 'Error!',
			message: errorMsg,
		},
	}[type]);
