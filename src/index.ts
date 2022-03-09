import chalk from "chalk"
import {exec} from "child_process"
import inquirer from "inquirer"
import express from "express"
import fs from "fs"

var USERDATA = {}
var __RAW_USERDATA__ = ""

// read the ShellUtils.config.json file at ~ or /home/[current user]/ (on gnu / linux) 

if (fs.existsSync("~/.ShellUtils.config.json")) {
  // read the file, parse and set the USERDATA variable to the result

  USERDATA = JSON.parse(fs.readFileSync("~/.ShellUtils.config.json").toString())
  __RAW_USERDATA__ = fs.readFileSync("~/.ShellUtils.config.json").toString()
} else {

  fs.writeFileSync("~/.ShellUtils.config.json", "{}")
  USERDATA = {}
  __RAW_USERDATA__ = "{}"

}

var COMMAND = {
  name: process.argv[1],
  args: {},
  options: {}
}

// generate command options
process.argv.splice(1, 2).map((arg, ind) => {
  if arg.beginsWith("--") {
    COMMAND.options[arg] = process.argv[ind++]
  }
})

function main() {

}

main()

function startWebServer() {
  var app = new express()
  
  // insert app routes
  
  app.get("/ui", (req, res) => {
    res.sendFile("./react/dist/index.html")
  })

  app.get("/api", (req, res) => {
    res.send("<h1>Welcome to ShellUtils. It appears that you have found the api request endpoints. :D</h1>")
  })

  app.listen("7580")
}
