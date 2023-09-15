# Ch2. Symbolic link

충돌이 나지 않게 바로가기 만들기.

디렉토리, 시스템, 머신까지 전반에 걸쳐 작동해야 한다.

이를 위해서는 `proxy` 디자인이 필요하다.

//

## Proxy

Proxy는 구조적 디자인 패턴으로, 다른 객체에 대한 접근을 제어하기 위한

대리자나 placeholder를 제공하는데 유용하다.

기존의 오리지널 서비스 객체와 동일한 인터페이스를 가진 proxy class를 생성한다.

그 후, app을 업데이트해 모든 오리지널 객체의 client들이 이 proxy class를 지나서

올리지널 객체와 상호작용하도록 한다.

proxy는 client의 적절한 req를 서비스 객체에 전달한다.

### Key Concept

1. Proxy : 원본 서비스에 대한 접근을 제어하는 방식으로 원본 서비스를 나타내는 객체
2. Real Subject : proxy가 나타내는 원본 객체
3. Subject Interface : proxy, real subject 모두 이 인터페이스를 implement해
   real subject가 사용될 수 있는 곳엔 언제나 proxy도 사용될 수 있도록 한다.

### common use case

1. lazy initialization
   생성이나 load가 비싼 서비스 객체의 경우 proxy가 로딩 시점을 정할 수 있다.

2. access control
   원본 서비스에 req를 전달하기 전 이를 검증할 수 있다.

3. logging & monitoring
   디버깅을 위해 req를 log, 목적을 모니터링할 수 있다.

4. smart references
   proxy에서 요청에 로직을 추가 가능

이런 점들을 이용해 원본 파일/경로를 수정하지 않고도 파일이나 dir 등의 접근을 제어할 수 있음, (e.g. symbolic linking)

Proxy 를 file system에 mapping한다.

subject : interface to match > node
proxy : the stand-in class > link, the symbolic link obj
RealSubject : to which the proxy refers > ?

일단 RealSubject를 File이나 Directory에 commit하지 않아야 함.

//

1. FileEntity를 implement하는 Link class를 만든다.
   Link class가 proxy 역할을 함.

2. method, field를 잘 구현한다.
   name, path는 알거고, target field를 추가해 이 바로가기가 뭘 지정하는지 넣는다.
3. Folder의 add method가 Link도 parameter로 받을 수 있도록 수정한다.

//

심볼릭 링크를 원하는 폴더의 FileEntity에 대해 생성하려면 findChild emthod만으로는 충분하지 않았다.

현재 폴더든 루트폴더에서든 (아마 루트 폴더가 나을듯) 타깃을 재귀적으로 탐색해 나갈 수 있어야 함.

그래서 Folder class에 findEntryRecursively method를 추가했다. (./Composite.ts)

프롬프트에 타깃을 입력하면 루트폴더부터 쭉 탐색해서 타깃을 찾을거임..

//

절대 경로, 상대 경로 맞추는게 어렵네..

정말 하면 할수록 어렵다..

method들이 너무 재귀적이지 않고 cmd쪽이 재귀적인 것 같아서

이걸 수정하고 있는데 잘 구현 안된거나 수정해야 할 로직이 너무 많다..

여기에 너무 시간 뺏기는것 같은데..

일단 cmd 함수 정리를 좀 했고,

심볼릭 링크 마무리 후 다음으로 넘어가자.

//

지금 child 추가/제거시 그게 parent children 목록에 적용이 되지 않는 문제가 있다.

아마 chilren 배열에서 빼주는걸 안해서 그런것 같은데..

File class에도 parent field를 추가하던가, (이건 바꿀게 좀 많아짐)

current Folder 값을 이용해 접근해 (재귀적으로 거까지 currentFolder를 바꿔가므로)

제거하던가..

생각보다 구현해야할 기본 기능들이 정말 많네..

설마 나중에 다른 디자인 패턴에서 구현하는거 아니겠지..

없었던 것 같긴 한데..
