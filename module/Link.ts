import fs from "fs";
import { FileEntity, Folder, File } from "./Composite";

export class Link implements FileEntity {
        name: string;
        path: string;
        target: FileEntity;

        constructor(name: string, path: string, target: FileEntity) {
                this.name = name;
                this.path = path;
                this.target = target;
        }

        show(indent: number): void {
                this.target.show(indent);
        }

        // 원본이 아닌 자신만 삭제
        remove() {
                fs.unlinkSync(this.path);
        }

        readStream(): void {
                if (this.target instanceof File) {
                        this.target.readStream();
                }
        }

        writeStream(dt: string | Buffer | Array<string | Buffer>) {
                if (this.target instanceof File) {
                        this.target.writeStream(dt);
                }
        }

        add(child: FileEntity): any {
                if (this.target instanceof Folder) {
                        this.target.add(child);
                }
        }

        findChild(name: string): FileEntity | null {
                if (this.target instanceof Folder) {
                        return this.target.findChild(name);
                } else {
                        return null;
                }
        }

        load() {
                if (this.target instanceof Folder) {
                        this.target.load();
                }
        }

        getParent() {
                if (this.target instanceof Folder) {
                        return this.target.parent;
                }
        }
}
