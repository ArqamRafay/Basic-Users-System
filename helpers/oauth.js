// asyncHandler = require('./app/helpers/asyncMiddleware'),
const
	User = require('../models/').User,
	Token = require('../models/').Token;

module.exports.getClient = async (clientId, clientSecret, callback) => {
	try {
		const client = await User.findOne({ where: { clientId: clientId, secret: clientSecret } });
		callback(false, JSON.parse(JSON.stringify(client)));
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in getClient : ', error);
	}
};

module.exports.grantTypeAllowed = (clientId, grantType, callback) => {
	callback(false, grantType === "password" || grantType === "refresh_token");
};

module.exports.getUser = async (details, callback) => {
	try {
		var user;
		d = JSON.parse(JSON.stringify(details));
		if (details.type && details.type == 'local') {
			console.log('local');
			user = await User.findOne({ where: { email: d.email, password: d.password } });
		}

		// if (details.type && details.type == 'facebook') {
		// 	console.log('facebook');
		// 	user = await User.findOne({ where: { email: d.email, fb_id: d.fb_id } });
		// }
		//
		if (details.type && details.type == 'google') {
			// console.log('outh.js | google');
			// console.log(d)
			// console.log('outh.js | google 2');
			user = await User.findOne({ where: { email: d.email, google_id: d.google_id } });
		}

		// console.log('user :', JSON.parse(JSON.stringify(user)));

		// user = await User.findOne({ where: { username: username, password: password } });
		callback(false, JSON.parse(JSON.stringify(user)));
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in getUser : ', error);
	}
};

module.exports.saveAccessToken = async (accessToken, clientId, expires, user, callback) => {
	try {
		const record = await Token.findOne({ where: { user_id: JSON.parse(JSON.stringify(user)).id } });
		if (record) {
			const token = await Token.update({
				accessToken: accessToken,
				expires: expires
			},
				{
					where: {
						user_id: JSON.parse(JSON.stringify(user)).id
					}
				});
		}
		else {
			const token = await Token.create({
				accessToken: accessToken,
				expires: expires,
				user_id: JSON.parse(JSON.stringify(user)).id
			});
		}

		callback(false);
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in saveAccessToken : ', error);
	}
};

module.exports.saveRefreshToken = async (refreshToken, clientId, expires, user, callback) => {
	try {
		const token = await Token.update({
			refreshToken: refreshToken,
			refreshTokenExpires: expires
		},
			{
				where: {
					user_id: JSON.parse(JSON.stringify(user)).id
				}
			})
		callback(false);
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in saveRefreshToken : ', error);
	}
};

module.exports.getAccessToken = async (accessToken, callback) => {
	try {
		const token = await Token.findOne({ where: { accessToken: accessToken } });
		callback(false, { expires: token.dataValues.expires });
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in getAccessToken : ', error);
	}
}

module.exports.getRefreshToken = async (refreshToken, callback) => {
	try {
		var token = await Token.findOne({ where: { refreshToken: refreshToken } });
		token = JSON.parse(JSON.stringify(token));
		var userExist = await User.findById(token.user_id);
		token.clientId = userExist.clientId;
		console.log('token :', token);
		callback(false, token);
		// callback(false, {expires: token.dataValues.refreshTokenExpires});
	}
	catch (error) {
		callback(true);
		// res.status(400).send('Error in getRefreshToken : ', error);
	}

}
