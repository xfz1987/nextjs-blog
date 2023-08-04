const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = phase => {
	// 开发环境
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		return {
			env: {
				mongodb_username: 'xfz',
				mongodb_password: '2MBYB09wuR3HQrnq',
				mongodb_clustername: 'cluster0',
				mongodb_database: 'test',
			},
			reactStrictMode: true,
		};
	}

	// 其他环境
	return {
		env: {
			mongodb_username: 'xfz',
			mongodb_password: '2MBYB09wuR3HQrnq',
			mongodb_clustername: 'cluster0',
			mongodb_database: 'test',
		},
		reactStrictMode: true,
	};
};

// module.exports = {
// 	env: {
// 		mongodb_username: 'xfz',
// 		mongodb_password: '2MBYB09wuR3HQrnq',
// 		mongodb_clustername: 'cluster0',
// 		mongodb_database: 'test',
// 	},
// 	reactStrictMode: true,
// };
