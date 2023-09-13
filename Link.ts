import { FileEntity, Folder } from "./Composite";

class Link implements FileEntity {
        name : string;
        path : string;
        private target : FileEntity
        
        constructor(name : string, path : string, target : FileEntity) {
                this.name = name;
                this.path = path;
                this.target = target;
        }
        
        show(indent: number): void {
                this.target.show(indent)
        }
        
        remove(): string | null {
                return this.target.remove();
        }
        
        add(child: FileEntity) : any {
                if(this.target instanceof Folder) {
                        this.target.add(child)
                }
        }
        
        findChild(name : string) : FileEntity | null {
                if(this.target instanceof Folder) {
                        return this.target.findChild(name)
                } else {
                        return null
                }
        }
        
        load() {
                if(this.target instanceof Folder) {
                        this.target.load()
                }
        }
        
        setParent(parent : Folder) {
                if(this.target instanceof Folder) {
                        this.target.setParent(parent)
                }
        }
        
        getParent() {
                if(this.target instanceof Folder) {
                        return this.target.parent
                }
        }
}