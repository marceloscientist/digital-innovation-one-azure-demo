const { ObjectID } = require('mongodb');
const createMongoClient = require('../shared/mongoClient');

module.exports = async function (context, req) {
  const { id } = req.params;
  const user = req.body || {};

  if (!id || !user) {
    context.res = {
      status: 400,
      body: 'Provide a user and user id on params',
    };
    return;
  }

  const { client: MongoClient, closeConnectionFn } = await createMongoClient();
  const Users = MongoClient.collection('users');

  try {
    const users = await Users.findOneAndUpdate(
      { _id: ObjectID(id) },
      { $set: user },
    );
    closeConnectionFn();
    context.res = { status: 200, body: users };
  } catch (error) {
    context.res = {
      status: 500,
      body: 'Error on insert user',
    }; 
  }
};