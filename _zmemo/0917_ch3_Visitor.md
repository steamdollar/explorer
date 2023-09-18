# Ch 3. Open-ended functionality

사용자가 파일 탐색기에서 어떤 기능을 원할지 모르므로,

기능을 언제든 추가할 수 있어야 함.

이를 위해서는 기능의 외부화 (알고리즘과 이를 실행하는 객체구조의 분리)가 필요하며,

`Visitor` 패턴을 사용해 이를 구현할 수 있다.

## Pattern : Visitor

알고리즘을 이를 실행하는 객체 구조에서 분리한다.

객체 구조가 복잡할 때 (e.g. composite tree) 혹은 그 class를 변경하지 않고

이 class에 대해 다양한 작업을 수행하고 싶을 때 사용한다.

### Basic

1. Visitor Interface

방문하고 싶은 요소 각각의 타입에 대해 대응하는 method를 정의한다. method는 각 타입의 el을 받았을 때 뭘 해야하는지를 선언한다.

2. Concrete Visitor

Visitor interface를 구현, 각 el에 대한 action 정의

3. Element Interface

모든 visitable class에 의해 구현된 interface. 보통 visitor를 인자로 받는 accept라는 method가 있다.

4. Concrete Element

작업을 수행하는 실제 객체. 3을 구현한다.

### How it works

작업을 수행하고 싶다면 객체 구조를 이용해 Visitor를 보낸다.

각 구조의 el은 `accept` 메소드를 가지고 있어, 자신을 인수로 전달한다.

이 후, visitor는 방문하는 el의 대응하는 method를 호출해 원하는 작업을 수행한다.

### Advantages

1. 단일 책임 원칙 (Single responsibilty principle, SRP)

각 class의 책임에 집중할 수 있으므로 객체 구조 클래스가 관련 없는 method로 채워지지 않게 할 수 있다.

- SRP : 어떤 클래스를 변경하는 이유는 하나 뿐이어야 한다.
  == 하나의 객체는 하나의 기능만을 수행하는 책임을 갖는다. (코드의 의존성, 결합성의 감소)

2. 개방/폐쇄 원칙 (Open/Closed Principle)

다른 class의 변경 없이 해당 class 객체와 작동할 수 있는 새로운 행동을 도입할 수 있다.

코드를 수정하지 않고도 객체에 새로운 작업을 추가할 수 있다.

//

단, add, remove등 기존부터 class에 존재했던, class와 밀접한 연관이 있는 method들을 바꿀 필요는 없다.

`Visitor`는 이런 객체의 기저에 깔린 method에 대해 사용하는게 아니라,

obj를 변경하지 않아도 되는 top layer쪽에 작용하는 작업에 사용한다.

(e.g. `SizeCalCulator` visitor는 각 File, Folder에 방문에 크기를 (대상 객체를 수정하지 않고)

계산해 리턴한다.)

//
