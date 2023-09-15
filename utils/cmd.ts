import { File, Folder } from "../module/Composite";
import { Link } from "../module/Link";
import { ls, cd, mkdir, touch, ln, rm } from "./func";

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
                                currentFolder,
                                rootFolder,
                                args[0]
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
                        // TODO : recursive하게 동작하도록 바꿔서 subdir을 인식할 수 있도록..
                        // const nameToRemove = args[0];
                        // const childEntity =
                        //         currentFolder.findChild(nameToRemove);
                        // if (childEntity) {
                        //         const removeResult = childEntity.remove();

                        //         if (removeResult === null) {
                        //                 // Successfully removed, so now update the 'children' array
                        //                 const index =
                        //                         currentFolder.children.indexOf(
                        //                                 childEntity
                        //                         );
                        //                 currentFolder.children.splice(index, 1);
                        //                 console.log(
                        //                         `Removed ${nameToRemove} successfully.`
                        //                 );
                        //         } else {
                        //                 console.log(removeResult);
                        //         }
                        // } else {
                        //         console.log(
                        //                 `Error: No file or folder with the name ${nameToRemove} exists.`
                        //         );
                        // }
                        rm(args[0], currentFolder, rootFolder);
                        break;

                case "ln":
                        ln(rootFolder, currentFolder, args);
                        break;

                default:
                        console.log("Unknown command");
        }
};
