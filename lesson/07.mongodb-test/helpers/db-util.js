import { MongoClient, ObjectId } from 'mongodb';

export async function connectDatabase() {
	const client = await MongoClient.connect(
		'mongodb+srv://xfz:2MBYB09wuR3HQrnq@cluster0.jdiygge.mongodb.net/test?retryWrites=true&w=majority'
	);

	return client;
}

export async function insertDocument(client, collection, document) {
	const db = client.db();

	const result = await db.collection(collection).insertOne(document);

	return result;
}

export async function getAllDocuments(client, collection, sort) {
	const db = client.db();

	const documents = await db.collection(collection).find().sort(sort).toArray();

	return documents;
}

export async function getDocumentById(client, collection, id) {
	const db = client.db();
	const document = await db
		.collection(collection)
		.find({ _id: new ObjectId(id) })
		.toArray();

	return document[0];
}

export async function deleteDocumentById(client, collection, id) {
	const db = client.db();
	const document = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
	const { deletedCount } = document;
	return deletedCount > 0;
}
