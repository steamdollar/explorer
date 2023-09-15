import { Folder, File, FileEntity } from "../module/Composite";
import { Link } from "../module/Link";

const isAbs = (path: string): boolean => {
        return path.startsWith("/");
};

// ls를 제외한 대부분의 기능은 재귀적으로 동작해야 함..
export const ls = (currentFolder: Folder) => {
        console.log(
                currentFolder.children.map((child) => child.name).join(" ")
        );
};

// 뭔가 이상한데.. 이 함수가 이렇게 커도 되나?
// class 안의 method들이 재귀적이어야 하는거 아닌가?
// 얘가 재귀적이어도 되나?
export const cd = (
        currentFolder: Folder,
        rootFolder: Folder,
        target: string
) => {
        if (target === "..") {
                const parentFolder = currentFolder.getParent();
                if (parentFolder !== null) {
                        return parentFolder;
                } else {
                        console.log("Already at root folder");
                        return currentFolder;
                }
        }

        const destination = currentFolder.findEntryRecursively(
                target,
                currentFolder,
                rootFolder
        );

        if (destination instanceof Folder) {
                return destination;
        } else {
                console.log("Target is not a folder or does not exist.");
                return currentFolder;
        }
};

export const mkdir = (
        path: string,
        currentFolder: Folder,
        rootFolder: Folder
) => {
        let startFolder = isAbs(path) ? rootFolder : currentFolder;

        if (isAbs(path)) {
                path = path.substring(1);
        }

        const folderNames = path.split("/");
        let targetFolder = startFolder;

        for (const folderName of folderNames) {
                const newFolder = new Folder(folderName, path, targetFolder);
                // subdir이 있는 경우 target을 계속 바꿔주며 진입해야함.
                targetFolder = targetFolder.add(newFolder);
        }
};

export const touch = (
        path: string,
        currentFolder: Folder,
        rootFolder: Folder
) => {
        let startFolder = isAbs(path) ? rootFolder : currentFolder;

        if (isAbs(path)) {
                path = path.substring(1);
        }

        const filePath = path.split("/");
        let dir = startFolder;

        for (const folder of filePath) {
                let l = 0;
                const newFolder = new Folder(
                        folder,
                        `${dir.path}/${folder}`,
                        dir
                );
                dir = dir.add(newFolder);
                if (l >= filePath.length - 2) {
                        break;
                }
                l++;
        }

        dir.add(
                new File(
                        filePath[filePath.length - 1],
                        `${currentFolder.path}/${filePath[filePath.length - 1]}`
                )
        );
};

export const rm = (path: string, currentFolder: Folder, rootFolder: Folder) => {
        let startFolder = isAbs(path) ? rootFolder : currentFolder;

        if (isAbs(path)) {
                path = path.substring(1);
        }

        const target = startFolder.findEntryRecursively(
                path,
                currentFolder,
                rootFolder
        );

        if (target instanceof Folder || target instanceof File) {
                target.remove();
                currentFolder.children.filter((v) => v !== target);
        } else {
                console.error(`Err : Cannot find Entity : ${path}`);
        }
};

export const ln = (
        rootFolder: Folder,
        currentFolder: Folder,
        args: string[]
) => {
        const targetName = args[0];
        const linkName = args[1];

        const targetEntity = rootFolder.findEntryRecursively(
                targetName,
                currentFolder,
                rootFolder
        );
        if (targetEntity) {
                const newLink = new Link(
                        linkName,
                        `${currentFolder.path}/${linkName}`,
                        targetEntity
                );
                currentFolder.add(newLink);
        } else {
                console.error(`Error : Target Entity doesn't exist.`);
        }
};
