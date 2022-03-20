#!/bin/env node

/*
 * ////////////////////////////////////////
 * //      ShellUtils © 2022 Ewsgit      //
 * //   Licensed under the MIT License   //
 * ////////////////////////////////////////
 */

/*
 * ////////////////////////////////////////
 * //      ShellUtils © 2022 Ewsgit      //
 * //   Licensed under the MIT License   //
 * ////////////////////////////////////////
 */

import chalk from "chalk"
import { exec } from "child_process"
import inquirer from "inquirer"
import path from "path"
import os from "os"
import express from "express"
import fs from "fs"
import open from "open"

const CONSTANTS = {
  homedir: os.homedir()
}

let WEB_SERVER;

let USERDATA = {}
let __RAW_USERDATA__ = ""

// read the ShellUtils.config.json file at ~ or /home/[current user]/ (on gnu/linux)

if ( fs.existsSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ) ) ) {
  // read the file, parse and set the USERDATA variable to the result

  USERDATA = JSON.parse( fs.readFileSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ) ).toString() )
  __RAW_USERDATA__ = fs.readFileSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ) ).toString()
} else {

  fs.writeFileSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ), "{}" )
  USERDATA = {}
  __RAW_USERDATA__ = "{}"

}

let COMMAND: {
  name: string, args: any, options: any,
} = {
  name: process.argv[ 2 ],
  args: {},
  options: {}
}

// generate command options
process.argv.splice( 1, 2 ).map( ( arg, ind ) => {
  if ( arg.startsWith( "--" ) ) {
    COMMAND.options[ arg ] = process.argv[ ind++ ]
  }
} )

function main() {
  if ( __RAW_USERDATA__ === "{}" ) {
    // run setup
    console.log( chalk.yellow( "Welcome to ShellUtils! - By the DevDash project." ) );
    console.log( "open browser to continue setup?" );
    inquirer
      .prompt( [
        {
          type: "confirm",
          name: "openBrowser",
          message: "Open browser?"
        }
      ] )
      .then( res => {
        if ( res.openBrowser ) {
          startWebServer();
          open( "http://localhost:54377/ui" )
        } else {
          console.log( "Automated setup cancelled. you can manually setup ShellUtils by editing" + " the .ShellUtils.config.json file in your home directory." );
          exitCli();
        }
      } )
  } else {
    if ( COMMAND.name ) {
      switch ( COMMAND.name.toLowerCase() ) {
        case "proj":
          console.log( "Hello" )
          break;
        default:
          console.log( chalk.bgHex( "#333" ).hex( "#f77" ).bold( " Error " ) + ` No command called "${ COMMAND.name }" was found. Run "s help" for a list of valid commands.` )
      }
    } else {
      console.log( chalk.bgHex( "#333" ).hex( "#f77" ).bold( " Error " ) + ` No command was entered. run "s help" for a list of valid commands.` )
    }
  }
}

main()

// save user data
fs.writeFileSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ), JSON.stringify( USERDATA ) )

function startWebServer() {
  let app = express()

  // insert app routes 
  app.get( "/ui", ( req, res ) => {
    let is_dev = false
    if ( COMMAND.options.dev === true ) {
      is_dev = true;
    }
    res.sendFile( is_dev === false ? path.join(path.resolve("./"), "./root/dist/index.html") : path.join(path.resolve("./"), "./root/public/index.html") )
  } )

  app.get("/api/shutdown", (req, res) => {
    res.send("Server Shutting Down...")
    setTimeout(() => {

    exitWebServer()
    }, 500)
  })

  app.get( "/api", ( req, res ) => {
    res.send( "<h1>Welcome to ShellUtils. It appears that you have found the api request endpoints. :D</h1>" )
  } )

  WEB_SERVER = app.listen( "54377" , () => {
    console.log("DEBUG: " + "Starting Express Server on port 54377")
  })
}

function exitWebServer() {
  WEB_SERVER.close()
}

function exitCli() {
  fs.writeFileSync( path.join( CONSTANTS.homedir, ".ShellUtils.config.json" ), JSON.stringify( USERDATA ) )
  process.exit()
}

/*
 *  if (userConfig_Raw === "{}") {
 // run the setup
 console.log(
 chalk.yellow("Welcome to ShellUtils! - By the DevDash project.")
 );
 console.log("open browser to continue setup?");
 inquirer
 .prompt([
 {
 type: "confirm",
 name: "openBrowser",
 message: "Open browser?",
 },
 ])
 .then(res => {
 if (res.openBrowser) {
 WebUI();
 open("http://localhost:3000");
 } else {
 console.log(
 "Automated setup cancelled. you can manually setup ShellUtils by editing the config.json file in the .ShellUtils folder in your home directory."
 );
 exitCli();
 }
 });
 } else {
 switch (INPUT.command) {
 case "h":
 case "?":
 case "help":
 command = () => {
 var commands: {
 name: string;
 description: string;
 aliases?: string[];
 }[] = [
 {
 name: "help",
 description: "Display this help message",
 aliases: ["h", "?"],
 },
 {
 name: "project",
 description: "manage projects",
 aliases: ["proj"],
 },
 ];
 console.log(
 chalk.yellow(
 ` --- ShellUtils | DevDash v${SHELLUTILS_VERSION} --- `
 )
 );
 for (let i = 0; i < commands.length; i++) {
 stdout.write(`${commands[i].name} - ${commands[i].description}\n`);
 if (commands[i].aliases) {
 for (let j = 0; j < commands[i].aliases.length; j++) {
 if (j === commands[i].aliases.length - 1) {
 stdout.write(`  ╚═ `);
 } else {
 stdout.write(`  ╠═ `);
 }
 stdout.write(`${commands[i].aliases[j]} (alias)\n`);
 }
 }
 }
 };
 command();
 exitCli();
 break;
 case "proj":
 case "project":
 command = () => {
 switch (INPUT.args[0]) {
 case "list":
 if (userConfig.projects) {
 if (userConfig.projects.length > 0) {
 for (let i = 0; i < userConfig.projects.length; i++) {
 stdout.write(`${userConfig.projects[i].name}\n`);
 }
 } else {
 stdout.write(`No projects found.\n`);
 }
 } else {
 userConfig.projects = [];
 stdout.write(`No projects found.\n`);
 }
 break;
 case "create":
 if (userConfig.preferedWizard) {
 if (userConfig.preferedWizard === "terminal") {
 // use inqurier
 console.log("Coming soon! - changing to web wizard");
 WebUI();
 open("http://localhost:3000/project/create");
 } else {
 // use web wizard
 WebUI();
 open("http://localhost:3000/project/create");
 }
 }
 break;
 default:
 var commands: {
 name: string;
 description: string;
 aliases?: string[];
 }[] = [
 {
 name: "list",
 description: "List all local projects",
 },
 {
 name: "create",
 description: "Create a new project",
 },
 ];
 for (let i = 0; i < commands.length; i++) {
 stdout.write(
 `${commands[i].name} - ${commands[i].description}\n`
 );
 if (commands[i].aliases) {
 for (let j = 0; j < commands[i].aliases.length; j++) {
 if (j === commands[i].aliases.length - 1) {
 stdout.write(`  ╚═ `);
 } else {
 stdout.write(`  ╠═ `);
 }
 stdout.write(`${commands[i].aliases[j]} (alias)\n`);
 }
 }
 }
 }
 };
 command();
 exitCli();
 break;
 default:
 console.log(
 chalk.bgGray.bold.red(
 " Command not found - type 's help' for help on all commands "
 )
 * */
