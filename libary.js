export function callError(message) {
	console.log(" ERROR ".red.bgBlack + " " + message)
}

export function callSuccess(message) {
	console.log(" SUCCESS ".green.bgBlack + " " + message)
}

export function callWarning(message) {
	console.log(" WARNING ".yellow.bgBlack + " " + message)
}

export function callInfo(message) {
	console.log(" INFO ".blue.bgBlack + " " + message)
}