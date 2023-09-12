import { File, Folder } from '../Composite'

export const executeCommand = (input :string, currentFolder : Folder) : any => {
        const [command, ...args] = input.split(" ")
        
        switch (command) {
                case 'ls' :
                        console.log(currentFolder.children.map(child => child.name).join(' '))
                        break;
                        
                case 'cd' :
                        const target = args[0]
                        const nextFolder = currentFolder.findChild(target)

                        if(nextFolder instanceof Folder) {

                                return nextFolder
                        } else {
                                console.log('Target is not folder')
                        }
                        break;
                
                case 'mkdir':
                        // Create new folder
                        const folderName = args[0];
                        currentFolder.add(new Folder(folderName, `${currentFolder.path}/${folderName}`));
                        break;
                          
                case 'touch':
                        // Create new file
                        const fileName = args[0];
                        currentFolder.add(new File(fileName, `${currentFolder.path}/${fileName}`));
                        break;
                          
                        // Add more commands as needed
                
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