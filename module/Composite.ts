import fs from "fs";
import path from "path";
import { Link } from "./Link";
import { rootDir } from "../utils/env";
import { FileSystemVisitor, SizeCalculator } from "./visitor";

// act as component
export interface FileEntity {
        // properties
        name: string;
        path: string;
        // parent : string;

        // methods
        // indent : 앞에 몇 칸 띄울지..
        show(indent: number): void;
        remove(): string | null | void;
        getSize(): number;

        accept(visitor: FileSystemVisitor): void;
}

// composite (leaf)
export class File implements FileEntity {
        static rootDir = rootDir;

        constructor(
                public name: string,
                public path: string // public parent : string
        ) {}

        accept(visitor: FileSystemVisitor): void {
                visitor.visitFile(this);
        }

        show(indent: number) {
                console.log(`${" ".repeat(indent)}File: ${this.name}`);
        }

        remove() {
                try {
                        fs.unlinkSync(this.path);
                        return null;
                } catch (e) {
                        return `Error: Could not delete the file. ${e}`;
                }
        }

        readStream() {
                const readStream = fs.createReadStream(this.path);

                readStream.on("data", (chunk) => {
                        console.log(chunk.toString());
                });

                readStream.on("end", () => {
                        console.log("file reading Completed");
                });

                readStream.on("error", (err) => {
                        console.error(`err : ${err.message}`);
                });
        }

        writeStream(dt: string | Buffer | Array<string | Buffer>) {
                const writeStream = fs.createWriteStream(this.path);

                writeStream.write(dt);

                writeStream.end(() => {
                        console.log("file write completed.");
                });

                writeStream.on("error", (err) => {
                        console.error(`Err : ${err.message}`);
                });
        }

        getSize(): number {
                return fs.statSync(this.path).size;
        }
}

// composite (composition)
export class Folder implements FileEntity {
        name: string;
        path: string;
        parent: Folder | null = null;
        static rootDir = rootDir;

        public children: (FileEntity | Link)[] = [];

        constructor(name: string, path: string, parent: Folder | null = null) {
                this.name = name;
                this.path = path;
                this.parent = parent;
        }

        accept(visitor: FileSystemVisitor): void {
                if (visitor instanceof SizeCalculator) {
                        visitor.visitFolder(this);
                }
        }

        // for ls
        show(indent: number) {
                console.log(`${" ".repeat(indent)}Folder: ${this.name}`);
                for (const child of this.children) {
                        child.show(indent + 4);
                }
        }

        // for mkdir, touch, ln
        add(child: FileEntity | Link): any {
                const childPath = path.join(this.path, child.name);

                const existingFolder = this.children.find(
                        (existingChild) =>
                                existingChild instanceof Folder &&
                                existingChild.name === child.name
                );

                if (
                        existingFolder instanceof Folder &&
                        child instanceof Folder
                ) {
                        return existingFolder;
                }

                const nameExists = this.children.some(
                        (existingChild) => existingChild.name === child.name
                );
                if (nameExists) {
                        console.error(
                                `Error: A file with the name ${child.name} already exists.`
                        );
                }

                if (child instanceof Folder) {
                        fs.mkdirSync(childPath, { recursive: true });
                } else if (child instanceof File) {
                        fs.writeFileSync(childPath, "");
                } else if (child instanceof Link) {
                        // new Link(child.name, child.path, child.target)
                        fs.symlink(child.target.path, childPath, (err) => {
                                if (err)
                                        console.error(
                                                `Failed to create symbolic link : ${err}`
                                        );
                        });
                }

                this.children.push(child);

                return child instanceof Folder ? child : null;
        }

        // for rm
        remove() {
                try {
                        fs.rmdirSync(this.path, { recursive: true });
                        return null;
                } catch (err) {
                        return `Error: Could not delete the folder. ${err}`;
                }
        }

        findChild(name: string): FileEntity | Link | null {
                const childEntity = this.children.find(
                        (child) => child.name === name
                );
                return childEntity || null;
        }

        // 지정된 경로/파일 탐색
        findEntryRecursively(
                targetPath: string,
                currentFolder: Folder,
                rootFolder: Folder
        ): FileEntity | null {
                let initialFolder = this.isAbs(targetPath)
                        ? rootFolder
                        : currentFolder;

                if (this.isAbs(targetPath)) {
                        targetPath = targetPath.substring(1);
                }

                const pathParts = targetPath.split("/");

                const helper = (
                        folder: Folder,
                        remain: string[]
                ): FileEntity | null => {
                        if (remain.length === 0) return null;

                        const next = remain.shift();

                        const childEntity = folder.children.find(
                                (child) => child.name === next
                        );

                        if (!childEntity) return null;

                        if (remain.length === 0) {
                                return childEntity;
                        }

                        if (childEntity instanceof Folder) {
                                return helper(childEntity, remain);
                        }

                        return null;
                };

                return helper(initialFolder, pathParts);
        }

        // children들을 읽는다.
        load(rootFolder?: Folder) {
                // path의 entry들을 읽는다.
                const entries = fs.readdirSync(this.path, {
                        withFileTypes: true,
                });

                // 찾은 각 entry들에 대해
                for (const entry of entries) {
                        const entryPath = path.join(this.path, entry.name);

                        // entry가 폴더인 경우
                        if (entry.isDirectory()) {
                                // 해당 폴더에서 파일이 나올 때까지 재귀적으로 호출
                                const folder = new Folder(
                                        entry.name,
                                        entryPath,
                                        this
                                );
                                folder.load();
                                this.children.push(folder);
                        } else if (entry.isFile()) {
                                const file = new File(entry.name, entryPath);
                                this.children.push(file);
                                // 이게 어렵다.. 어쩌지..
                        } else if (entry.isSymbolicLink()) {
                                // 이걸 잘라야 함.. 얘가 탐색기 루트 폴더가 되도록..

                                const targetPath = fs.readlinkSync(entryPath);

                                // TODO : link의 path 수정
                                // 지금 path가 절대경로로 나와서 중간을 잘라야 함..

                                const targetEntity = this.findEntryRecursively(
                                        targetPath.substring(
                                                rootDir.length + 1
                                        ),
                                        this,
                                        rootFolder!
                                );

                                if (
                                        targetEntity instanceof File ||
                                        targetEntity instanceof Folder
                                ) {
                                        const link = new Link(
                                                entry.name,
                                                entryPath,
                                                targetEntity
                                        );
                                        this.children.push(link);
                                }
                        }
                }
        }

        getParent() {
                return this.parent;
        }

        getSize(): number {
                let totalSize = 0;

                for (const child of this.children) {
                        totalSize += child.getSize();
                }

                return totalSize;
        }

        isAbs(targetPath: string): boolean {
                return targetPath.startsWith("/");
        }
}

// const rootPath = './ex'
// const root = new Folder('ex(root)', rootPath)

// root.load()

// console.log(root)

// Folder {
//         children: [
//           File { name: '1.txt', path: 'ex/1.txt' },
//           File { name: 'a.txt', path: 'ex/a.txt' },
//           Folder { children: [Array], name: 'd1', path: 'ex/d1' },
//           File { name: 'zz.png', path: 'ex/zz.png' }
//         ],
//         name: 'ex(root)',
//         path: './ex'
//       }

// root.show(0)
