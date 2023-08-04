// when [...slug] and [id] all exist at the same time. the route will be this:
// http://localhost:3000/events/a -> [eventId]
// http://localhost:3000/events/a/b -> [...slug]

import { useRouter } from 'next/router';
import { getFilteredEvents } from '@/mock/dummy-data';
import EventList from '@/components/events/event-list';
import ResultsTitle from '@/components/events/results-title';
import Button from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';

const FilteredEventsPage = () => {
	const {
		query: { slug },
	} = useRouter();

	if (!slug) {
		return <p className='center'>Loading...</p>;
	}

	const [year, month, _] = slug;

	const numYear = +year;
	const numMonth = +month;

	if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021 || numMonth < 1 || numMonth > 12) {
		<>
			<ErrorAlert>
				<p>Invalid filter. Please adjust your values!</p>
			</ErrorAlert>
			<div className='center'>
				<Button link='/events'>Show All Events</Button>
			</div>
		</>;
	}

	const filteredEvents = getFilteredEvents({
		year: numYear,
		month: numMonth,
	});

	if (!filteredEvents || filteredEvents.length === 0) {
		return (
			<>
				<ErrorAlert>
					<p>No events found for the chosen filter!</p>
				</ErrorAlert>
				<div className='center'>
					<Button link='/events'>Show All Events</Button>
				</div>
			</>
		);
	}

	const date = new Date(numYear, numMonth - 1);

	return (
		<>
			<ResultsTitle date={date} />
			<EventList items={filteredEvents} />
		</>
	);
};

export default FilteredEventsPage;
