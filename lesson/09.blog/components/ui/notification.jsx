import { createPortal } from 'react-dom';
import classNames from 'classnames/bind';
import classes from './notification.module.css';

const ctx = classNames.bind(classes);

function Notification(props) {
	const { title, message, status } = props;

	return createPortal(
		<div
			className={ctx('notification', {
				success: status === 'success',
				error: status === 'error',
			})}
		>
			<h2>{title}</h2>
			<p>{message}</p>
		</div>,
		document.getElementById('notifications')
	);
}

export default Notification;
