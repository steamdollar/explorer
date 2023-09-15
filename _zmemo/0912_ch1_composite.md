파일 탐색기 만들기를 통해 디자인 패턴의 종류와 활용 예시를 알아보자.

# Ch1 : Structure - Composite

루트 폴더 이하 모든 객체(폴더, 파일)들을 동일하게 다룬다는 것이 중요하다.

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

file, folder에 대해 필요한 각 method를 추가하고, 적절하게 사용해주면 될 것 같다.

FileEntity abstract class에 공통적으로 있어야 하는 method들을 정의하고, 

(abstract 붙으면 이걸로 인스턴스화는 할 수 없고, 이걸 상속받은 class들을 인스턴스화 해서 씀)

각각을 구현해줌..

완벽하진 않지만 디자인 패턴의 이해와 구현에 집중하고 싶으므로 일단 넘어간다.