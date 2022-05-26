const User = require('../../../models/User');
const Post = require('../../../models/Post');
const _ = require('lodash');
// const { Op } = require("sequelize");


const calculatePages = (usersTotal, usersPerPage) => {
	return (
		(usersTotal < usersPerPage)
		? 1
		: Math.ceil(usersTotal / usersPerPage)
	);
}

/**
 * 
 * turns ms date into a string format
 * 1653524690937 => "2022-05-26 02:24:50.937"
 */
const formatDate = (dateNumber) => {
	const _date = new Date(dateNumber);
	const formattedDate = {
		year: _date.getFullYear(),
		month: _date.getMonth()<9?`0${_date.getMonth()+1}`:`${_date.getMonth()+1}`,
		day: _date.getDate()<10?`0${_date.getDate()}`:_date.getDate(),
		hours: _date.getHours()<10?`0${_date.getHours()}`:_date.getHours(),
		minutes: _date.getMinutes()<10?`0${_date.getMinutes()}`:_date.getMinutes(),
		seconds: _date.getSeconds()<10?`0${_date.getSeconds()}`:_date.getSeconds(),
		miliseconds: _date.getMilliseconds()<10?`0${_date.getMilliseconds()}`:_date.getMilliseconds(),
	}
	
	return `${formattedDate.year}-${formattedDate.month}-${formattedDate.day} ${formattedDate.hours}:${formattedDate.minutes}:${formattedDate.seconds}.${formattedDate.miliseconds}`;
}

const extractAndFormatUsersData = (users) => {
	const data = [];

	users.forEach(user => {
		const formattedUser = {
			id: user?.dataValues?.id,
			name: user?.dataValues?.name,
			posts: [],
		};
		data.push(formattedUser);
	});

	return data;
}

const extractAndFormatUserPostsData = (posts) => {
	let data = [];

	data = posts.map(post => {
		return {
			id: post?.dataValues?.id,
			title: post?.dataValues?.title,
			body: post?.dataValues?.body,
			created_at: formatDate(post?.dataValues?.created_at),
		}
	});

	return data;
}

const getUsers = async (page, per) => {
	console.time(`\x1b[33m [users] Fetching Users.. \x1b[0m`);
	
	const offset = (page - 1) * per;
	const users = await User.findAll({
		order: [
			['created_at', 'DESC'],
		],
		offset,
		limit: per,
	});

	console.timeEnd(`\x1b[33m [users] Fetching Users.. \x1b[0m`);
	return users;
}

const getUserRecentPosts = async (userId) => {
	console.time(`\x1b[33m [/api/v1/users] Fetching User Posts.. \x1b[0m`);
	
	const users = await Post.findAll({
		where: {
			author_id: userId,
		},
		order: [
			['created_at', 'DESC'],
		],
		limit: 2,
	});

	console.timeEnd(`\x1b[33m [/api/v1/users] Fetching User Posts.. \x1b[0m`);
	return users;
};


/**
 * GET users and their recent posts with pagination built in.
 * /api/v1/users?page={number}&per={number}
 */
module.exports = (router) => {
	router.get('/users', async (req, res, next) => {
		const query = {
			page: req?.query?.page,
			per: req?.query?.per,
		};
		let responseMessage = null;

		// checking if the query parameters are numbers
		if (isNaN(query.page) || isNaN(query.per)) {
			return res.status(400).json({responseMessage: "invalid_query"});
		}

		// converting query parameters to Number type
		query.page = Number(query.page);
		query.per = Number(query.per);

		// forming JSON reponse
		const jsonResponse = {
			data: [],
			pagination: {
				total_count: null,
				total_pages: null,
			},
		};

		// calculating pagination properties
		const userCount = await User.count();
		jsonResponse.pagination.total_count = userCount;
		jsonResponse.pagination.total_pages = calculatePages(userCount, query.per);

		// Get array of users
		const users = await getUsers(query.page, query.per);

		// Error while getting data from db
		if (typeof users !== 'object')
			return res.status(502).json({responseMessage: "error_500"});
		
		// No users in db
		if (users?.length === 0)
			return res.status(200).json(jsonResponse);

		// format User data an
		jsonResponse.data = extractAndFormatUsersData(users);

		// Get each Users' Posts 
		for await (const user of jsonResponse.data) {
			let posts = await getUserRecentPosts(user.id);
			user.posts = extractAndFormatUserPostsData(posts);
		}

		res.status(200).json(jsonResponse);
	});
};