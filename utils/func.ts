import { Folder, File, FileEntity } from "../module/Composite";
import { Link } from "../module/Link";
import { SizeCalculator } from "../module/visitor";

const isAbs = (path: string): boolean => {
        return path.startsWith("/");
};

// ls를 제외한 대부분의 기능은 재귀적으로 동작해야 함..
export const ls = (currentFolder: Folder) => {
        console.log(
                currentFolder.children.map((child) => child.name).join(" ")
        );
};

export const cd = (
        target: string,
        currentFolder: Folder,
        rootFolder: Folder
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

        let dir = startFolder;

        const filePath = path.split("/");

        for (const folder of filePath) {
                const newFolder = new Folder(
                        folder,
                        `${dir.path}/${folder}`,
                        dir
                );
                dir = dir.add(newFolder) as Folder;
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

        let dir = startFolder;

        const filePath = path.split("/");
        const route = filePath.pop();

        for (const folder of filePath) {
                const newFolder = new Folder(
                        folder,
                        `${dir.path}/${folder}`,
                        dir
                );
                dir = dir.add(newFolder) as Folder;
        }

        dir.add(new File(route!, `${currentFolder.path}/${route}`));
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
                currentFolder.children = currentFolder.children.filter(
                        (v) => v !== target
                );
        } else {
                console.error(`Err : Cannot find Entity : ${path}`);
        }
};

export const ln = (
        args: string[],
        currentFolder: Folder,
        rootFolder: Folder
) => {
        let target = args[0];
        let sym = args[1];

        let startFolder = isAbs(target) ? rootFolder : currentFolder;

        if (isAbs(target)) {
                target = target.substring(1);
        }

        const targetEntity = rootFolder.findEntryRecursively(
                target,
                currentFolder,
                rootFolder
        );

        if (targetEntity) {
                const newLink = new Link(
                        args[1],
                        `${currentFolder.path}/${args[1]}`,
                        targetEntity
                );
                currentFolder.add(newLink);
        } else {
                console.error(`Error : Target Entity doesn't exist.`);
        }
};

export const cat = (
        args: string[],
        currentFolder: Folder,
        rootFolder: Folder
) => {
        const targetEntity = rootFolder.findEntryRecursively(
                args[0],
                currentFolder,
                rootFolder
        );

        if (
                targetEntity &&
                (targetEntity instanceof File || targetEntity instanceof Link)
        ) {
                targetEntity.readStream();
        } else {
                console.error(`There is no file named ${targetEntity}`);
        }
};

export const size = (
        targetPath: string,
        currentFolder: Folder,
        rootFolder: Folder
) => {
        let startFolder = isAbs(targetPath) ? rootFolder : currentFolder;

        if (isAbs(targetPath)) {
                targetPath = targetPath.substring(1);
        }

        const targetEntity = rootFolder.findEntryRecursively(
                targetPath,
                currentFolder,
                rootFolder
        );

        if (targetEntity) {
                const sizeCalculator = new SizeCalculator();
                targetEntity.accept(sizeCalculator);

                console.log(
                        `${targetPath} - size : ${sizeCalculator.getTotalSize()}`
                );
        } else {
                console.error(`target doesn't exist`);
        }
};
