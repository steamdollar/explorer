// 정말 터미널이 동작하는 것처럼 해보고 싶다..
// std input, output 같은거 쓰는 연습도 할 겸..

import readline from "readline";
import { Folder } from "./module/Composite";
import { executeCommand } from "./utils/cmd";

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
});

const rootFolder = new Folder("/", "//mnt/d/daily/project/file_explorer/ex");

let currentFolder = new Folder("/", "//mnt/d/daily/project/file_explorer/ex");
currentFolder.load(rootFolder);

rl.prompt();

rl.on("line", (input) => {
        const [command, ...args] = input.split(" ");
        if (command === "cd") {
                currentFolder = executeCommand(
                        input,
                        currentFolder,
                        rootFolder
                );
        } else {
                executeCommand(input, currentFolder, rootFolder);
        }

        rl.prompt();
});
