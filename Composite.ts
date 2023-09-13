import fs from "fs";
import path from "path"

// act as component
export interface FileEntity {
        // properties
        name : string;
        path : string;
        
        // methods
        // indent : 앞에 몇 칸 띄울지..
        show(indent : number) : void
        remove() : string | null
}

// composite (leaf)
export class File implements FileEntity {
        constructor(public name : string, public path : string) {}

        show(indent : number) {
                console.log(`${" ".repeat(indent)}File: ${this.name}`);
        }
        
        remove() {
                try {
                        fs.unlinkSync(this.path)
                        return null        
                } catch (e) {
                        return `Error: Could not delete the file. ${e}`
                }

        }
}

// composite (composition)
export class Folder implements FileEntity {
        name : string;
        path : string;
        parent : Folder | null = null
        
        // 폴더 내부의 파일들 목록인듯
        public children : FileEntity[] = [] 
        
        constructor(name : string, path : string, parent : Folder | null = null) {
                this.name = name
                this.path = path
                this.parent = parent
        }

        show(indent : number) {
                console.log(`${" ".repeat(indent)}Folder: ${this.name}`)
                for (const child of this.children) {
                        child.show(indent + 4)
                }
        }
        
        add(child: FileEntity) : any {
                const childPath = path.join(this.path, child.name)
                
                const existingFolder = this.children.find(existingChild => 
                        existingChild instanceof Folder && existingChild.name === child.name);
                
                if(existingFolder instanceof Folder && child instanceof Folder) {
                        return existingFolder
                }        
                
                const nameExists = this.children.some(existingChild => existingChild.name === child.name);
                if (nameExists) {
                        return `Error: A file with the name ${child.name} already exists.`;
                }
                
                if(child instanceof Folder) {
                        fs.mkdirSync(childPath, {recursive : true})
                } else if (child instanceof File) {
                        fs.writeFileSync(childPath, '')
                }
                
                this.children.push(child)
                
                return child instanceof Folder ? child : null
        }
        
        remove() {
                try {
                        fs.rmdirSync(this.path, { recursive: true });
                        return null;
                } catch (err) {
                        return `Error: Could not delete the folder. ${err}`;
                }
        }
        
        findChild(name : string) : FileEntity | null {
                const childEntity = this.children.find(child => child.name === name)
                return childEntity || null
        }
        
        // children들을 읽는다.
        load() {
                // path의 entry들을 읽는다.
                const entries = fs.readdirSync(this.path, { withFileTypes : true })
                
                // 찾은 각 entry들에 대해
                for ( const entry of entries) {
                        const entryPath = path.join(this.path, entry.name);
                        
                        // entry가 폴더인 경우
                        if(entry.isDirectory()) {
                                // 해당 폴더에서 파일이 나올 때까지 재귀적으로 호출
                                const folder = new Folder(entry.name, entryPath, this)
                                folder.load()
                                this.children.push(folder)
                        } else if (entry.isFile()) {
                                const file = new File(entry.name, entryPath)
                                this.children.push(file)
                        }
                }
        }
        
        setParent(parent : Folder) {
                this.parent = parent
        }
        
        getParent() {
                return this.parent;
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