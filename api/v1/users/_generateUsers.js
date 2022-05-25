const { v4: uuidv4 } = require('uuid');
const User = require('../../../models/User');
const _ = require('lodash');
const hoaxer = require('hoaxer');

// User data generator
const generateUserAccount = () => {
	return {
		id: uuidv4(),
		name: hoaxer.name.firstName(),
		//body: hoaxer.lorem.paragraph(),
		created_at: new Date().getTime(),
	};
}

// User post data generator
const generateUserPosts = (userId, numberOfPosts) => {
	const posts = [];
	_.range(numberOfPosts).forEach(() => {
		posts.push({
			id: uuidv4(),
			author_id: userId,
			title: hoaxer.company.companyName(),
			body: hoaxer.lorem.paragraph(),
			created_at: new Date().getTime(),
		});
	});
	return posts;
}

/**
 * GET generate fake user accounts.
 * /api/v1/generateUsers?userCount={number}&maxPosts={number}
 */
module.exports = (router) => {
	router.get('/generateUsers', function(req, res, next) {
		// query parameters
		const query = {
			userCount: req?.query?.userCount,
			maxPosts: req?.query?.maxPosts,
		};

		// checking if the query parameters are numbers
		if (isNaN(query.userCount) || isNaN(query.maxPosts)) {
			return res.status(400).json({responseMessage: "Invalid query parameters"});
		}

		// converting query parameters to Number type
		query.userCount = Number(query.userCount);
		query.maxPosts = Number(query.maxPosts);
		
		// checking if number of users to generate is at least 1
		if (query.userCount < 1)
			return res.status(400).json({responseMessage: "userCount has to be at least 1"});

		// database generation
		_.range(query.userCount).forEach((i) => {
			const newUser = generateUserAccount();
			// console.log(`${i+1}`)
			// console.log(newUser)

			
			if (query.maxPosts)
				generateUserPosts(newUser.id, _.random(query.maxPosts));
		})

		// if (query.maxPosts)
		// 	console.log(generateUserPosts("uuidv4", _.random(query.maxPosts)));

		//new Date().getTime()

		res.status(200).json(query);
	});
};