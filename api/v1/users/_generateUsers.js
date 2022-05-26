const { v4: uuidv4 } = require('uuid');
const User = require('../../../models/User');
const Post = require('../../../models/Post');
const _ = require('lodash');
const hoaxer = require('hoaxer');

// User data generator
const generateUserAccountData = () => {
	return {
		id: uuidv4(),
		name: hoaxer.name.firstName(),
		created_at: new Date().getTime(),
	};
}

// User post data generator
const generateUserPostsData = (userId, numberOfPosts) => {
	const posts = [];
	if (numberOfPosts) {
		_.range(numberOfPosts).forEach(() => {
			posts.push({
				id: uuidv4(),
				author_id: userId,
				title: hoaxer.company.companyName(),
				body: hoaxer.lorem.paragraph(),
				created_at: new Date().getTime(),
			});
		});
	}
	return posts;
}

// Add a new User and its Posts to the database
const createUserAccountAndPosts = (userData, posts) => {
	console.time(`\x1b[33m [/api/v1/generateUsers] Adding new user: '${userData.name}' (${posts.length} posts) \x1b[0m`);
	User.create(userData)
		.then(user => {
			posts.forEach((post) => {
				user.createPost(post);
			});
		})
		.catch(error => Error(error));

	console.timeEnd(`\x1b[33m [/api/v1/generateUsers] Adding new user: '${userData.name}' (${posts.length} posts) \x1b[0m`);
}

/**
 * GET generate fake user accounts.
 * /api/v1/generateUsers?userCount={number}&maxPosts={number}
 */
module.exports = (router) => {
	router.get('/generateUsers', (req, res, next) => {
		// get query parameters
		const query = {
			userCount: req?.query?.userCount,
			maxPosts: req?.query?.maxPosts,
		};

		// checking if the query parameters are numbers
		if (isNaN(query.userCount) || isNaN(query.maxPosts)) {
			return res.status(400).json({responseMessage: "invalid_query"});
		}

		// converting query parameters to Number type
		query.userCount = Number(query.userCount);
		query.maxPosts = Number(query.maxPosts);
		
		// checking if number of users to generate is at least 1
		if (query.userCount < 1)
			return res.status(400).json({responseMessage: "invalid_query::count"});

		// database generation
		_.range(query.userCount).forEach((i) => {
			// Create new User with Posts
			const newUserData = generateUserAccountData();
			const newUserPostsData = generateUserPostsData(newUserData.id, (query.maxPosts?_.random(query.maxPosts):query.maxPosts));
			createUserAccountAndPosts(newUserData, newUserPostsData);

		});

		res.status(200).json({"responseMessage": "success"});
	});
};