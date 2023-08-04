import { useRouter } from 'next/router';
import { useCallback } from 'react';
import EventList from '@/components/events/event-list';
import EventsSearch from '@/components/events/events-search';
import { getAllEvents } from '@/mock/dummy-data';

const AllEventsPage = () => {
	const events = getAllEvents();
	const router = useRouter();

	const findEventsHandler = useCallback((year, month) => {
		const fullPath = `/events/${year}/${month}`;
		router.push(fullPath);
	}, []);

	return (
		<div>
			<EventsSearch onSearch={findEventsHandler} />
			<EventList items={events} />
		</div>
	);
};

export default AllEventsPage;
