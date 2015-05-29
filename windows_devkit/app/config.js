window.CONFIG = {};

// paths
window.CONFIG.paths = {
	root:		window.location.protocol + '//' + window.location.hostname + ':' + window.location.port,
	login:		'https://devkit.athom.com/auth',
	apiRoot:	'https://api.athom.com',
	account:	'https://my.athom.com'
};

// url whitelist
window.CONFIG.whitelist = [
	'self',
	'file://',
	'http://*.athom.com/**',
	'https://*.athom.com/**'
];