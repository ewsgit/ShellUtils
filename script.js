import { callInfo, callError, callSuccess, callWarning } from "./libary.js";
import fs from "fs";
import { execSync, exec, spawn } from "child_process";

export default function utils(args) {
  if (args[1]) {
    switch (args[1].toLowerCase()) {
      case "folder":
        exec(`explorer "${process.argv[1].replace("cli.js", "")}\scripts\"`);
        break;
      case "run":
        if (!args[2]) return callError("No script name specified");
        if (
          !fs.existsSync(
            `${process.argv[1].replace("cli.js", "")}scripts\\${args[2]}.js`
          )
        )
          return callError(`Script ${args[2]} does not exist`);
        if (
          fs.existsSync(
            `${process.argv[1].replace("cli.js", "")}scripts\\${
              args[2]
            }.requires`
          )
        ) {
          for (
            let i = 0;
            i <
            fs
              .readFileSync(
                `${process.argv[1].replace("cli.js", "")}scripts\\${
                  args[2]
                }.requires`
              )
              .toString()
              .split("\n").length;
            i++
          ) {
            if (
              fs
                .readFileSync(
                  `${process.argv[1].replace("cli.js", "")}scripts\\${
                    args[2]
                  }.requires`
                )
                .toString()
                .split("\n")[i]
            .startsWith("#")) return
              exec(
                `npm i ${
                  fs
                    .readFileSync(
                      `${process.argv[1].replace("cli.js", "")}scripts\\${
                        args[2]
                      }.requires`
                    )
                    .toString()
                    .split("\n")[i]
                }`
              );
          }
        }
        exec(
          `node "${process.argv[1].replace("cli.js", "")}scripts\\${
            args[2]
          }.js"`
        );
        break;
      case "help":
        console.log(`----- ${`Help`.yellow} -----`);
        console.log(
          `list - list all utilities\nfolder - open the utility script folder\nreload - reload the utility scripts in the folder`
        );
        console.log(`----------------`);
        break;
      default:
        callError("An Unknown Sub-Command Was Entered");
    }
  } else {
    callError(`Do "s utils help" for a list of commands.`);
  }
}
