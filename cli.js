#!/usr/bin/env node

import fs from "fs";
import "colors";
import fetch from "node-fetch";
import childProcess from "child_process";
import script from "./script.js";
import { callError, callInfo, callSuccess, callWarning } from "./libary.js";

var args = process.argv.slice(2);

if (args[0]) {
  switch (args[0].toLowerCase()) {
    case "script":
    case "script":
      script(args);
      break;
    case "open":
    case "op":
      if (args[1]) {
        if (fs.existsSync(args[1])) {
          if (fs.lstatSync(args[1]).isDirectory()) {
            console.log("Opening folder:".green, args[1]);
            // run code [Filename / dirname] command
            childProcess.exec(`code ${args[1]}`, (err) => {
              if (err) {
                callError(err);
                return;
              }
            });
          } else {
            console.log("Opening file:".green, args[1]);
            // run code [Filename / dirname] command
            childProcess.exec(`code ${args[1]}`, (err) => {
              if (err) {
                callError(err);
                return;
              }
            });
          }
        } else {
          callError("File / Folder does not exist.");
        }
      } else {
        callError("Please specify a file or folder to open.");
      }
      break;
    case "cr":
    case "create":
      if (args[1]) {
        if (!fs.existsSync(args[1])) {
          fs.writeFile(args[1], "", (err) => {
            if (err) {
              callError("An Error Occured");
            } else {
              callSuccess("File created successfully");
            }
          });
        } else {
          callError("File already exists");
        }
      } else {
        callError("No file name provided");
      }
      break;
    case "remove":
    case "rm":
      if (args[1]) {
        if (fs.existsSync(args[1])) {
          fs.unlink(args[1], (err) => {
            if (err) {
              callError("An Error Occured");
            } else {
              callSuccess("File deleted successfully");
            }
          });
        } else {
          callError("File does not exist");
        }
      } else {
        callError("No file provided");
      }
      break;
    case "help":
    case "h":
      console.log(
        "--------------- " +
          "Shell Utils".yellow +
          " ---------------" +
          "\nhelp - this menu" +
          "\nh - help " +
          "(alias)".yellow +
          "\ncreate " +
          "[fileName / path]".green +
          " - create a file\ncr - create " +
          "(alias)".yellow +
          "\nremove " +
          "[fileName / path]".green +
          " - remove a file\nrm - remove " +
          "(alias)".yellow +
          "\nclear - clear the screen\ncls - clear " +
          "(alias)".yellow +
          "\ncl - clear " +
          "(alias)".yellow +
          "\nopen - open a file in your editor of choice " +
          "[fileName / path]".green +
          "\nop - open " +
          "(alias)".yellow +
          "\nclear - clear the terminal " +
          "\ncls - clear " +
          "(alias)".yellow +
          "\n" +
          "------------------------------------------- "
      );
      break;
    case "clear":
    case "cls":
    case "cl":
      console.clear();
      break;
    case "createdir":
    case "crd":
      if (args[1]) {
        if (!fs.existsSync(args[1])) {
          fs.mkdir(args[1], (err) => {
            if (err) {
              callError("An Error Occured");
            } else {
              callSuccess("Directory created successfully");
            }
          });
        } else {
          callError("Directory already exists");
        }
      } else {
        callError("No directory name provided");
      }
      break;
    case "removedir":
    case "rmd":
      if (args[1]) {
        if (fs.existsSync(args[1])) {
          fs.rmdir(args[1], (err) => {
            if (err) {
              callError("An Error Occured");
            } else {
              callSuccess("Directory deleted successfully");
            }
          });
        } else {
          callError("Directory does not exist");
        }
      } else {
        callError("No directory provided");
      }
      break;
    case "createdirs":
    case "crds":
      var dirs = args.slice(1);
      if (dirs.length > 0) {
        dirs.forEach((dir) => {
          if (!fs.existsSync(dir)) {
            fs.mkdir(dir, (err) => {
              if (err) {
                callError("An Error Occured");
              } else {
                callSuccess("Directory created successfully");
              }
            });
          } else {
            callError("Directory already exists");
          }
        });
      } else {
        callError("No directories provided");
      }
      break;
    case "removedirs":
    case "rmds":
      var dirs = args.slice(1);
      if (dirs.length > 0) {
        dirs.forEach((dir) => {
          if (fs.existsSync(dir)) {
            fs.rmdir(dir, (err) => {
              if (err) {
                callError("An Error Occured");
              } else {
                callSuccess("Directory deleted successfully");
              }
            });
          } else {
            callError("Directory does not exist");
          }
        });
      } else {
        callError("No directories provided");
      }
      break;
    case "test":
      callInfo("OK");
      break;
    case "list":
    case "ls":
      if (args[1]) {
        logDirectory(args[1]);
      } else {
        logDirectory();
      }
      break;
    case "listfiles":
    case "lsf":
      if (args[1]) {
        logDirectoryFiles(args[1]);
      } else {
        logDirectoryFiles();
      }
      break;
    case "listdirs":
    case "lsd":
      if (args[1]) {
        logDirectoryDirs(args[1]);
      } else {
        logDirectoryDirs();
      }
      break;
    case "infomation":
    case "info":
    case "version":
    case "vers":
      fs.readFile(
        process.argv[1].replace("cli.js", "version.txt"),
        (err, data) => {
          if (err) {
            callError("An Error Occured");
          } else {
            callInfo(`Current version: v${data}`);
            fetch(
              "https://api.github.com/repos/ewsgit/ShellUtils/releases/latest"
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.message !== "Not Found") {
                  callInfo("Latest release: v" + data.tag_name);
                  if (data.body !== "") {
                    callInfo("Release notes: " + data.body);
                  }
                  callInfo("Download link: " + data.zipball_url);
                }
                callInfo("Made By @Ewsgit");
              });
          }
        }
      );
      break;
    case "verechostr":
      fs.readFile(
        process.argv[1].replace("cli.js", "version.txt"),
        (err, data) => {
          if (err) return callError("Issue reading version file");
          console.log(`V${data}`);
        }
      );
      break;
    default:
      callError("Invalid command");
  }
} else {
  callError("Please enter a command");
}

function logDirectory(dir) {
  if (dir) {
    if (fs.existsSync(dir)) {
      fs.readdir(dir, (err, files) => {
        if (err) {
          callError("An Error Occured");
        } else {
          files.forEach((file) => {
            console.log(file);
          });
        }
      });
    } else {
      callError("Directory does not exist");
    }
  } else {
    fs.readdir("./", (err, files) => {
      if (err) {
        callError("An Error Occured");
      } else {
        callSuccess("Files in directory:");
        files.forEach((file) => {
          console.log(file);
        });
      }
    });
  }
}

function logDirectoryDirs(dir) {
  if (dir) {
    if (fs.existsSync(dir)) {
      fs.readdir(dir, (err, files) => {
        if (err) {
          callError("An Error Occured");
        } else {
          files.forEach((file) => {
            if (fs.lstatSync(file).isDirectory()) {
              console.log(file);
            }
          });
        }
      });
    } else {
      callError("Directory does not exist");
    }
  } else {
    fs.readdir("./", (err, files) => {
      if (err) {
        callError("An Error Occured");
      } else {
        callSuccess("Directories in directory:");
        files.forEach((file) => {
          if (fs.lstatSync(file).isDirectory()) {
            console.log(file);
          }
        });
      }
    });
  }
}

function logDirectoryFiles(dir) {
  if (dir) {
    if (fs.existsSync(dir)) {
      fs.readdir(dir, (err, files) => {
        if (err) {
          callError("An Error Occured");
        } else {
          files.forEach((file) => {
            if (fs.lstatSync(file).isFile()) {
              console.log(file);
            }
          });
        }
      });
    } else {
      callError("Directory does not exist");
    }
  } else {
    fs.readdir("./", (err, files) => {
      if (err) {
        callError("An Error Occured");
      } else {
        callSuccess("Files in directory:");
        files.forEach((file) => {
          if (fs.lstatSync(file).isFile()) {
            console.log(file);
          }
        });
      }
    });
  }
}
