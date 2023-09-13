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

