import { useContext } from 'react';
import NotificationContext from '../../notification-context';
export default function Text() {
	const notificationCtx = useContext(NotificationContext);

	notificationCtx.showNotification({
		title: 'Sending comment...',
		message: 'Your comment is currently being stored into a database.',
		status: 'pending',
	});
}
