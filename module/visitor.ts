import { File, Folder } from "./Composite";
import { Link } from "./Link";

export interface FileSystemVisitor {
        visitFile(file: File): void;
        visitFolder(folder: Folder): void;
        visitLink(link: Link): void;
}

export class SizeCalculator implements FileSystemVisitor {
        totalSize = 0;

        visitFile(file: File) {
                this.totalSize += file.getSize();
        }

        visitFolder(folder: Folder) {
                this.totalSize += folder.getSize();
        }

        visitLink(link: Link) {
                this.totalSize += link.getSize();
        }

        getTotalSize(): number {
                return this.totalSize;
        }
}

/*

        1. FileSystemVisitor interface 정의
        
        2. FileEntity 추상 class에 accept() method 추가
                FileEntity에 accept() method를 추가하고 각 class에 대충 선언만 해둔다.
        
        3. FileSystemVisitor 추상 클래스를 구현 (e.g. SizeCalculator)
        
        4. 구현된 Visitor class의 method를 각 FileEntity에서 호출하는걸 
        accept() method에서 구현한다.
        
        //
        
        코드의 흐름을 보면
        
        우선 size(...) 함수에서 목표의 크기를 구한다.
        
        크기는 링크, 파일, 폴더에 따라 구하는 방법이 다른데,
        
        특히 폴더는 그 안에 있는 child들의 크기의 합이 자신의 크기가 됨.
        
        이런 경우, recursive하게 크기를 구할 수도 있지만 (실제로 그렇게 헀고)
        
        visitor를 추가적으로 이용할 수도 있다.
        
        1. targetEntity를 시작지점부터 재귀적으로 탐색한다.
        
        2. taretEntity를 찾았다면, 
        
        (폴더인지 다른 종류인지 모르므로 sizeCalculator class를 사용해 해당 인스턴스의 크기를 구한다.)
        
        sizeCalculator 인스턴스를 만들고, 이를 target의 accept method의 인수로 주고 accept method를 호출한다.
        
        이 method 안에서 visitor의 함수를 실행한다. 결과는 sizeCalcultor에 누적시킨다.
        
        결과를 리턴하는 함수를 호출해 결과를 출력한다.
        
        
*/
