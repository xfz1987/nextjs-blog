function UserIdPage({ id }) {
	return <h1>{id}</h1>;
}

export default UserIdPage;

export async function getServerSideProps(context) {
	const {
		params: { uid },
	} = context;

	return {
		props: {
			id: 'userid-' + uid,
		},
	};
}
