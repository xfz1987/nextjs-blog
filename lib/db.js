import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
	const client = await MongoClient.connect(
		'mongodb+srv://xfz:2MBYB09wuR3HQrnq@cluster0.jdiygge.mongodb.net/test?retryWrites=true&w=majority'
	);

	return client;
}
