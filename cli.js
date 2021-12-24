#!/usr/bin/env node

import fs from "fs";
import "colors";
import fetch from "node-fetch";
import childProcess from "child_process";
import process from "process";
import { callError, callInfo, callSuccess, callWarning } from "./libs.js";
import nodeparity from "nodeparity";

const { $user, $home, $dirname, $filename } = nodeparity;

import os from "os";
var args = process.argv.slice(2);

init();

async function init() {
  if (fs.existsSync($home + "/.ShellUtils/settings.json")) {
    var settings = JSON.parse(fs.readFileSync($home + "/.ShellUtils/settings.json"));
    main(settings);
  } else {
    callInfo("There is no settings config file, creating one now.");
    await fs.writeFile(
      $home + "/.ShellUtils/settings.json",
      JSON.stringify({
        projects: [],
      }),
      err => {
        if (err) {
          callError("An Error Occured");
          process.exit();
        } else {
          callSuccess("Settings file created");
          process.exit();
        }
      }
    );
  }
}

function main(settings) {
  if (args[0]) {
    switch (args[0].toLowerCase()) {
      case "proj":
      case "project":
      case "projects":
        if (!settings.projects) {
          callWarning("There is a config error.");
          process.exit();
        }
        if (args[1]) {
          switch (args[1].toLowerCase()) {
            case "add":
              if (args[2]) {
                if (!args[3]) {
                  callError("please enter a name for the project");
                  process.exit();
                }
                if (fs.existsSync(args[2]) && fs.lstatSync(args[2]).isDirectory()) {
                  settings.projects.push({
                    name: args[3].toLowerCase(),
                    path: fs.realpathSync(args[2]),
                  });
                  callSuccess("Project " + args[3].toLowerCase() + " added");
                } else {
                  callError("Specified project directory does not exist.");
                  process.exit();
                }
              } else {
                callError("please enter a path for the project");
                process.exit();
              }
              break;
            case "create":
              if (args[2]) {
                if (!fs.existsSync(args[2])) {
                  fs.mkdirSync(args[2]);
                  callSuccess("Project " + args[2] + " created");
                  childProcess.exec("cd " + args[2] + " && code .");
                  settings.projects.push({
                    name: args[2].toLowerCase(),
                    path: fs.realpathSync(args[2]),
                  });
                } else {
                  callError("Project " + args[2] + " already exists");
                }
              } else {
                callError("please enter a name for the project");
                process.exit();
              }
              break;
            case "remove":
            case "delete":
              if (args[2]) {
                if (settings.projects.findIndex(x => x.name === args[2]) !== -1) {
                  var ind = settings.projects.findIndex(x => x.name === args[2]);
                  if (fs.existsSync(ind.path)) {
                    fs.rmdirSync(ind.path);
                    callSuccess("Project " + args[2] + " deleted");
                  } else {
                    callError("Project " + args[2] + " does not exist");
                  }
                } else {
                  callError("Project " + args[2] + " does not exist");
                }
              } else {
                callError("please enter a name for the project to delete");
                process.exit();
              }
              break;
            case "list":
              settings.projects.forEach(project => {
                callInfo(project.name);
              });
              break;
            default:
              // check if project args[1].toLowerCase() exists
              if (settings.projects.findIndex(x => x.name === args[1].toLowerCase()) !== -1) {
                callInfo("Opening project " + args[1].toLowerCase());
                childProcess.exec("s op " + settings.projects.find(x => x.name === args[1].toLowerCase()).path);
              } else {
                callError("Project does not exist");
              }
          }
        }
        if (!settings.projects[0] && (!args[1] || args[1] !== "add")) {
          callWarning(
            `There are no projects\nrun this command to add one: \"s ${args[0]}\ add <project relative path> <project name>\"`
          );
        } else if (!args[1]) {
          callInfo(`Projects:`);
          settings.projects.forEach(project => {
            callInfo(`${project.name}`);
          });
        }
        break;
      case "dotfile":
        if (os.platform() === "win32") {
          if (args[1]) {
            switch (args[1].toLowerCase()) {
              case "generate":
                callInfo("Starting to scan for dotfiles / config files!");
                // generate a config file
                var data = {
                  node_modules: [],
                  files: [],
                };
                var dotfileArray = [
                  {
                    name: ".gitconfig",
                    location: "~/.gitconfig",
                  },
                  {
                    name: "Microsoft.PowerShell_profile.ps1",
                    location: "~/Documents/Powershell/Microsoft.PowerShell_profile.ps1",
                  },
                  {
                    name: "theme.omp.json",
                    location: "~/theme.omp.json",
                  },
                ];
                for (let i = 0; i < dotfileArray.length; i++) {
                  dotfileArray[i].hostLocation = dotfileArray[i].location.replace(/~/, os.homedir());
                  if (fs.existsSync(dotfileArray[i].hostLocation)) {
                    data.files.push({
                      name: dotfileArray[i].name,
                      location: dotfileArray[i].location,
                      data: fs.readFileSync(dotfileArray[i].hostLocation, "utf8").toString(),
                    });
                    callInfo(`Found ${dotfileArray[i].name}`);
                  }
                }
                callInfo("Scanning for global node_modules...");
                if (fs.existsSync("~/AppData/Roaming/npm/node_modules".replace(/~/, os.homedir()))) {
                  fs.readdir("~/AppData/Roaming/npm/node_modules".replace(/~/, os.homedir()), (err, files) => {
                    for (let i = 0; i < files.length; i++) {
                      data.node_modules.push("~/AppData/Roaming/npm/node_modules" + files[i]);
                    }
                  });
                }
                fs.writeFile("dotfileconf.json", JSON.stringify(data, null, 2), err => {
                  if (err) {
                    callError("An Error Occured");
                  } else {
                    callSuccess("Config file generated");
                  }
                });
                break;
              case "load":
                // load a config file
                fs.readFile("dotfileconf.json", (err, data) => {
                  if (err) {
                    callError("An Error Occured");
                  } else {
                    callSuccess("Config file loaded");
                  }
                });
                break;
              default:
                callError("Invalid dotfile command");
            }
            break;
          } else {
            callError("Invalid dotfile command");
          }
        } else {
          callInfo("This command is currently only available on Windows");
        }
        break;
      case "ex":
      case "exp":
      case "explorer":
        if (os.platform() !== "win32") {
          callInfo("Explorer is only currently supported on windows");
        } else {
          if (args[1]) {
            childProcess.exec(`start ${args[1]}`);
          } else {
            childProcess.exec(`start .`);
          }
        }
        break;
      case "open":
      case "op":
        if (args[1]) {
          if (fs.existsSync(args[1])) {
            if (fs.lstatSync(args[1]).isDirectory()) {
              callInfo("Opening folder:".green, args[1]);
              // run code [Filename / dirname] command
              childProcess.exec(`code ${args[1]}`, err => {
                if (err) {
                  callError(err);
                  return;
                }
              });
            } else {
              callInfo("Opening file:".green, args[1]);
              // run code [Filename / dirname] command
              childProcess.exec(`code ${args[1]}`, err => {
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
          callInfo("Opening folder:".green + " .");
          // run code [Filename / dirname] command
          childProcess.exec(`code .`, err => {
            if (err) {
              callError(err);
              return;
            }
          });
        }
        break;
      case "cr":
      case "create":
        if (args[1]) {
          if (!fs.existsSync(args[1])) {
            fs.writeFile(args[1], "", err => {
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
            fs.unlink(args[1], err => {
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
            fs.mkdir(args[1], err => {
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
            fs.rmdir(args[1], err => {
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
          dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
              fs.mkdir(dir, err => {
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
          dirs.forEach(dir => {
            if (fs.existsSync(dir)) {
              fs.rmdir(dir, err => {
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
      case "helloworldsh":
        childProcess.exec(`${$home}/.ShellUtils/helloWorld.sh`, (err, stdout, stderr) => {
          if (err) {
            callError(err);
            return;
          } else {
            if (stdout) {
              console.log(stdout);
            } else if (stderr) {
              callError(stderr);
            }
          }
        });
        break;
      case "infomation":
      case "info":
      case "version":
      case "vers":
        fs.readFile($home + "/.ShellUtils/version.txt", (err, verdata) => {
          if (err) {
            callError("An Error Occured");
          } else {
            callInfo(`Current version: v${verdata}`);
            fetch("https://api.github.com/repos/ewsgit/ShellUtils/releases/latest")
              .then(response => response.json())
              .then(data => {
                if (data.message !== "Not Found") {
                  if (data.tag_name === verdata.toString()) {
                    return callInfo("You are using the latest version");
                  }
                  callInfo("New version available: v" + data.tag_name + ' use "s update" to update');
                  if (data.body !== "") {
                    callInfo("Release notes: " + data.body);
                  }
                  callInfo("Download link: " + data.zipball_url);
                }
                callInfo("Made By @Ewsgit");
              });
          }
        });
        break;
      case "verechostr":
        fs.readFile($home + "/.ShellUtils/version.txt", (err, data) => {
          if (err) return callError("Issue reading version file");
          console.log(`V${data}`);
        });
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
            files.forEach(file => {
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
          files.forEach(file => {
            console.log(file);
          });
        }
      });
    }
  }
  fs.writeFile($home + "/.ShellUtils/settings.json", JSON.stringify(settings), err => {
    if (err) {
      callError("An Error Occured");
    }
  });
}

function logDirectoryDirs(dir) {
  if (dir) {
    if (fs.existsSync(dir)) {
      fs.readdir(dir, (err, files) => {
        if (err) {
          callError("An Error Occured");
        } else {
          files.forEach(file => {
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
        files.forEach(file => {
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
          files.forEach(file => {
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
        files.forEach(file => {
          if (fs.lstatSync(file).isFile()) {
            console.log(file);
          }
        });
      }
    });
  }
}
