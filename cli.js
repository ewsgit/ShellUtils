#!/usr/bin/env node

import fs from 'fs';
import 'colors';

var args = process.argv.slice(2);

if (args[ 0 ]) {
	switch (args[ 0 ].toLowerCase()) {
		case "infomation":
		case "info":
			console.log("----- Shell Utils -----\n" + "    Made By @Ewsgit   \n" + "-----------------------")
			break;
		case "cr":
		case "create":
			if (args[ 1 ]) {
				if (!fs.existsSync(args[ 1 ])) {
					fs.writeFile(args[ 1 ], "", (err) => {
						if (err) {
							callError("An Error Occured")
						} else {
							callSuccess("File created successfully")
						}
					})
				} else {
					callError("File already exists")
				}
			} else {
				callError("No file name provided")
			}
			break;
		case "remove":
		case "rm":
			if (args[ 1 ]) {
				if (fs.existsSync(args[ 1 ])) {
					fs.unlink(args[ 1 ], (err) => {
						if (err) {
							callError("An Error Occured")
						} else {
							callSuccess("File deleted successfully")
						}
					}
					)
				} else {
					callError("File does not exist")
				}
			} else {
				callError("No file provided")
			}
			break;
		case "help":
		case "h":
			console.log("--------------- " + "Shell Utils".yellow + " ---------------\n" + "help - this menu\nh - help "
				+ "(alias)".yellow +
				"\ncreate " + "[fileName]".green + " - create a file\ncr - create " +
				"(alias)".yellow +
				"\nremove " + "[fileName]".green + " - remove a file\nrm - remove " +
				"(alias)".yellow +
				"\nclear - clear the screen\ncls - clear " +
				"(alias)".yellow +
				"\ncl - clear " +
				"(alias)".yellow +
				"\n" + "------------------------------------------- ")
			break;
		case "clear":
		case "cls":
		case "cl":
			console.clear()
			break;
		case "createdir":
		case "crd":
			if (args[ 1 ]) {
				if (!fs.existsSync(args[ 1 ])) {
					fs.mkdir(args[ 1 ], (err) => {
						if (err) {
							callError("An Error Occured")
						} else {
							callSuccess("Directory created successfully")
						}
					})
				} else {
					callError("Directory already exists")
				}
			} else {
				callError("No directory name provided")
			}
			break;
		case "removedir":
		case "rmd":
			if (args[ 1 ]) {
				if (fs.existsSync(args[ 1 ])) {
					fs.rmdir(args[ 1 ], (err) => {
						if (err) {
							callError("An Error Occured")
						} else {
							callSuccess("Directory deleted successfully")
						}
					}
					)
				} else {
					callError("Directory does not exist")
				}
			} else {
				callError("No directory provided")
			}
			break;
		default:
			callError("Invalid command")
	}
} else {
	callError("Please enter a command")
}


function callError(message) {
	console.log(" ERROR ".red.bgBlack + " " + message)
}

function callSuccess(message) {
	console.log(" SUCCESS ".green.bgBlack + " " + message)
}

function callWarning(message) {
	console.log(" WARNING ".yellow.bgBlack + " " + message)
}

function callInfo(message) {
	console.log(" INFO ".blue.bgBlack + " " + message)
}