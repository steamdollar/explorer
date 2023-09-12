/*
        Composite 패턴은 개별 객체와 객체의 구성요소들(compositions)를 일관적으로 다룰 수 있게 해준다.
        패턴은 두 가지 타입의 객체 "Composite", "Component"로  구성되어 있다.
        
        이 둘이 반드시 부모-자식 관계인 것은 아니고, tree 구조를 생성하는데 사용되는 방식으로 서로 연관되어있다.
        
        //
        
        1. Component
        "Component"는 abstract class or interface로, 개별 객체와 그 컴포지션 (복합체?) 둘 모두에 적용하고 싶은 공통 작업을 선언한다.
        Component class는 일반적으로 add(), remove(), getChild(), operation() 등이 있다.
        
        요약하자면 컴포넌트는 모든 concrete obj (leaves)와 그들의 복합체 (composites)를 위한 공통 인터페이스를 정의한다.
        
        
        2. Composite
        Composite는 concrete class로 Component interface를 구현한다.
        또한, 컴포넌트의 집합 (다른 Composite나 leaf node가 이에 해당할 수 있음)을 포함한다.
        
        Composite class에서는 자식 컴포넌트에 요청을 전달하는 방향으로 Component 인터페이스에 정의된 method들이 구현된다.
        
        3. Relationship btw Component & Composite
        - 부모 자식 관계 아님. Component interface의 user가 Composite라고 보면 된다.
        - 객체 트리의 관점에서, Composite가 parent node, 그 child Component(leaf or other composite)가 child 대응한다고 볼 수 있다.
        - Composite와 개별 객체 (leaves)모두 Component 인터페이스를 구현한다. 
                따라서 client는 이 둘을 따로 구분하지 않고 동일한 방식으로 다룰 수 있다.
        
*/

import fs from "fs";
import path from "path"

// act as component
interface FileEntity {
        // properties
        name : string;
        path : string;
        
        // methods
        // indent : 앞에 몇 칸 띄울지..
        show(indent : number) : void
        add?(child: FileEntity) : void
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
        
        // 폴더 내부의 파일들 목록인듯
        public children : FileEntity[] = [] 
        
        constructor(name : string, path : string) {
                this.name = name
                this.path = path
        }

        show(indent : number) {
                console.log(`${" ".repeat(indent)}Folder: ${this.name}`)
                for (const child of this.children) {
                        child.show(indent + 4)
                }
        }
        
        add(child: FileEntity) : string | null {
                const childPath = path.join(this.path, child.name)
                
                // 중복 체크
                const nameExists = this.children.some(existingChild => existingChild.name === child.name);
                if (nameExists) {
                        return `Error: A file or folder with the name ${child.name} already exists.`;
                }
                
                // folder일 경우
                if(child instanceof Folder) {
                        fs.mkdirSync(childPath, {recursive : true})
                } else if (child instanceof File) {
                        fs.writeFileSync(childPath, '')
                }
                
                this.children.push(child)
                
                return null
        }
        
        remove() {
                try {
                        // Remove the folder and its contents from disk
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
                                const folder = new Folder(entry.name, entryPath)
                                folder.load()
                                this.children.push(folder)
                        } else if (entry.isFile()) {
                                const file = new File(entry.name, entryPath)
                                this.children.push(file)
                        }
                }
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