

/**
 * GET users and their recent posts with pagination built in.
 * /api/v1/users?page={number}&per={number}
 */
module.exports = (router) => {
	router.get('/users', function(req, res, next) {
		res.status(200).json({
			"responseMessage": "Users array",
		});
	});
};