const test = process.env.NODE_ENV === 'test';

module.exports = {
	"presets": [
		"@babel/preset-env",
		[
			"@babel/preset-react",
			{
				"runtime": "automatic"
			}
		],
		"@babel/preset-typescript"
	],
	"plugins": [
		...(test ? ['babel-plugin-transform-import-meta'] : [])
	]
}
