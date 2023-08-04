import { buildFeedbackPath, extractFeedback } from '../api/feedback';
import { useState } from 'react';

function FeedBackPage(props) {
	const [feedbackData, setFeedbackData] = useState([]);

	function loadFeedbackHandler(id) {
		fetch(`/api/feedback/${id}`)
			.then(res => res.json())
			.then(data => {
				setFeedbackData(data.data);
			});
	}

	return (
		<>
			{feedbackData && <p>{feedbackData.email}</p>}
			<ul>
				{props.feedbackItems.map(item => (
					<li key={item.id}>
						{item.text}
						<button onClick={() => loadFeedbackHandler(item.id)}>Show Detail</button>
					</li>
				))}
			</ul>
		</>
	);
}

export async function getStaticProps(context) {
	const filePath = buildFeedbackPath();
	const data = extractFeedback(filePath);
	return {
		props: {
			feedbackItems: data,
		},
	};
}

export default FeedBackPage;
