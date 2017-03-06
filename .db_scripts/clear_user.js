
// empty communities user_id
db.Communities.updateMany(
	{},
	{$set: {user_id:[]}}
);

// remove all users
db.users.drop();
