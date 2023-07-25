const chrome = require('chrome-cookies-secure');
chrome.getCookies('https://web.quantsapp.com/option-scalping?tab=all', function(err, cookies) {
	console.log(cookies);
});