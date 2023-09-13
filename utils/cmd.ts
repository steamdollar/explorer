import { File, Folder } from '../Composite'

export const executeCommand = (input :string, currentFolder : Folder) : any => {
        const [command, ...args] = input.split(" ")
        
        switch (command) {
                case 'ls' :
                        console.log(currentFolder.children.map(child => child.name).join(' '))
                        break;
                        
                case 'cd' :
                        const target = args[0]
                        
                        if(args[0] == "..") {
                                const parentFolder = currentFolder.getParent()
                                if(parentFolder !== null) {
                                        return parentFolder
                                } else {
                                        console.log("Already at root folder")
                                        return currentFolder
                                }
                        }
                        
                        const nextFolder = currentFolder.findChild(target)

                        if(nextFolder instanceof Folder) {

                                return nextFolder
                        } else {
                                console.log('Target is not folder')
                                return currentFolder
                        }
                
                case 'mkdir':
                        const folderNames = args[0].split("/");
                        let targetFolder = currentFolder
                        
                        for(const folderName of folderNames) {
                                const newFolder = new Folder(folderName, `${targetFolder.path}/${folderName}`, targetFolder)
                                targetFolder = targetFolder.add(newFolder)
                        }
                        break;
                                        
                case 'touch':
                        const filePath = args[0].split("/");
                        let dir = currentFolder
                        for(const folder of filePath) {
                                let l = 0
                                const newFolder = new Folder(folder,`${dir.path}/${folder}`, dir )
                                dir = dir.add(newFolder)
                                if(l >= filePath.length - 2 ) {
                                        break;
                                }
                                l++
                        }
                        
                        dir.add(new File(filePath[filePath.length-1], `${currentFolder.path}/${filePath[filePath.length-1]}`));
                        break;
                          
                
                case "rm" :
                        const nameToRemove = args[0]
                        const childEntity = currentFolder.findChild(nameToRemove);
                        if (childEntity) {
                                const removeResult = childEntity.remove();
                        
                                if (removeResult === null) {
                                  // Successfully removed, so now update the 'children' array
                                        const index = currentFolder.children.indexOf(childEntity);
                                        currentFolder.children.splice(index, 1);
                                        console.log(`Removed ${nameToRemove} successfully.`);
                                } else {
                                        console.log(removeResult);
                                }
                        } else {
                                console.log(`Error: No file or folder with the name ${nameToRemove} exists.`);
                        }
                        break;

                default:
                        console.log('Unknown command');
        }
}