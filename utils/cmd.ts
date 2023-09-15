import { File, Folder } from "../module/Composite";
import { Link } from "../module/Link";
import { ls, cd, mkdir, touch, ln, rm, cat } from "./func";

export const executeCommand = (
        input: string,
        currentFolder: Folder,
        rootFolder: Folder
): any => {
        const [command, ...args] = input.split(" ");

        switch (command) {
                case "pwd":
                        console.log(currentFolder.path);
                        break;

                case "ls":
                        ls(currentFolder);
                        break;

                case "cd":
                        let newCurrentFolder = cd(
                                args[0],
                                currentFolder,
                                rootFolder
                        );
                        return newCurrentFolder;

                // TODO : 폴더 안에서 절대 경로로 폴더 생성하면 child로 인식이 안되는 문제 수정
                case "mkdir":
                        mkdir(args[0], currentFolder, rootFolder);
                        break;

                case "touch":
                        touch(args[0], currentFolder, rootFolder);
                        break;

                case "rm":
                        rm(args[0], currentFolder, rootFolder);
                        break;

                case "ln":
                        ln(args, currentFolder, rootFolder);
                        break;

                case "cat":
                        cat(args, currentFolder, rootFolder);
                        break;

                default:
                        console.log("Unknown command");
        }
};
