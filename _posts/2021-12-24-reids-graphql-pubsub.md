---
title:  "Redis를 활용한 실시간 알림 서비스 제작기 (Graphql-PubSub)"
excerpt: "redis-graphql-pubsub을 활용한 실시간 알림 서비스 제작기를 소개하고, 왜 이런 아키텍쳐를 적용했는지에 대해 알아본다."

categories:
  - graphql
  - real-time
  - architecture
tags:
  - redis
  - nestjs
last_modified_at: 2021-12-24 19:36:00
toc: true
toc_sticky: true
---



## 개요

[마지막 글](https://junkwon-dev.github.io/blog/ngrinder/)을 적고 벌써 1년이라는 시간이 지났다. 두들린의 백엔드 엔지니어로 일하게 됐고, 그동안 개발자로서 아주 많은 경험들을 할 수 있었다.

크게 정리하자면 쿠버네티스 환경 도입, MSA Architecture 도입, DDD Architecture 도입, Flask -> NestJS 프레임워크 변경, RabbitMQ를 활용한 기능 개발 등이 있겠다.

아키텍쳐에 대한 고민, 기능 개발, 인프라 관리, 리팩 등등 1년동안 정신없이 지낸 것 같다.

공유하면 재밌을 이야기가 많지만, 전부 하기엔 시간이 모자라고 (ㅎㅎ) 이번에 제작한 실시간 통합 알림 서비스에 대한 아키텍쳐에 대해 소개해주면 좋을 것 같다.

실시간성이라고 해서 겁을 많이 먹었는데, grapqhl-ws이라는 프로토콜이 있고, redis-graphql-pubsub이라는 라이브러리 덕에 아키텍쳐에 대한 고민만 잘 하면 누구나 실시간 프로그램을 제작할 수 있을 것이다.



## 사용된 기술

### 실시간 통신

[실시간 웹 통신](https://ko.wikipedia.org/wiki/%EC%8B%A4%EC%8B%9C%EA%B0%84_%EC%A0%84%EC%86%A1_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C). 어려운 개념이지만 내가 이해한 바로는 웹상에서 어떤 페이지 내에 있을 때 새로고침이나 어떠한 행위를 하지 않아도 서버에서 어떠한 데이터를 보여주려 하는 즉시 사용자가 확인이 가능한 것이라고 생각한다.

그런 점에서 알림 서비스는 누군가가 태그하거나, 면접을 시작할 때 등 그 즉시 사용자에게 알림(띠링~! 알림이 도착했습니다)이 추가가 되고 사용자가 확인할 수 있어야 하므로 실시간 웹 통신이 필요한 것이다.

내가 사용한 실시간 웹 통신 프로토콜은 [WebSocket](https://ko.wikipedia.org/wiki/%EC%9B%B9%EC%86%8C%EC%BC%93) 이며, 이는 HTTP 폴링과 같은 반이중방식에 비해 더 낮은 부하를 사용하여 [웹 브라우저](https://ko.wikipedia.org/wiki/웹_브라우저)(또는 다른 클라이언트 애플리케이션)과 [웹 서버](https://ko.wikipedia.org/wiki/웹_서버) 간의 통신을 가능케 하며, 서버와의 실시간 데이터 전송을 용이케 한다. (위키백과 참조)



### Graphql Subsription

우리가 사용하는 Graphql에서는 이런 실시간 서비스를 쉽게 구현할 수 있도록 Subscription이라는 Operation type을 지원한다. 해당 Operation type의 resolver에서 pubsub.asyncIterator interface의 구현체를 사용해서 반환해주면 바로 구독의 형태는 완성이 된다.

제품 서버에서 Redis를 사용하기 때문에, 나는 [graphql-redis-subscriptions](https://github.com/davidyaha/graphql-redis-subscriptions) 의 pubSub 구현체를 사용했다.



### Why Redis?

Pub/sub 구조에서 사용되는 중간 미들웨어의 종류는 많다. Redis, RabbitMQ, Kafka 등이 있고 처음에는 Kafka를 고려했지만 Redis로 결정했다.

Redis를 사용하게 된 이유는 다음과 같다. 

1. 우리의 아키텍쳐에서는 알림을 DB에 저장하기 때문에 미들웨어에는 저장될 필요가 없다. 캐시성 데이터면 충분하다(Redis는 발행된 이벤트를 저장하지 않음).
   - 저장될 필요가 없는데 kafka의 Partition 설정 및 유지보수는 리소스의 낭비이다.
2. 이벤트 발행시 구독자가 없다면 자동으로 휘발되는 Redis의 기능은 유지보수를 편하게 만든다.
3. 토픽을 자유롭게 설정할 수 있다.

위와 같은 이유로 Redis를 사용하기로 결정했다.



## 제작기

### 요구사항 분석

통합 알림 시스템을 구축하기에 앞서 나는 실시간 데이터는 무엇이어야 하는가에 대해 고민했다.

알림의 예시 사진

<img width="447" alt="스크린샷 2021-12-24 오후 3 16 00" src="https://user-images.githubusercontent.com/48988862/148213697-a82db12a-fab3-4929-8014-2ba2bbc14edf.png">



요구사항은 다음과 같다. 

어떤 사람에게 어떤 알림이 추가되었고, 혹은 읽었을 때에 따라 실시간으로 알림이 변경되어야 한다.

그렇다면 필요한 것은

1. 누구에게 알림이 추가되었을 때 어떤 알림인지
2. 누구에게 알림을 읽었을 때 어떤 알림인지

였고, 이를 정리하면 "누구에게", "언제(추가&읽음)", "알림의 내용" 세가지 데이터가 필요하다는 것을 알 수 있다.

따라서 Redis 메시지의 채널과 데이터를 다음과 같이 정의했다.

- 채널: "Alert추가됨(or 읽음)-누구에게"
- 메시지내용: "알림의 내용"



### Publish&Subscribe 제작

아키텍쳐를 고민하고 데이터의 형태를 분석하고 나니 개발은 금방 이루어졌다.

**Publish**

Redis는 토픽을 자유롭게 설정할 수 있고 발행시 구독자가 없다면 자동으로 휘발되기 때문에 채널의 생성 및 삭제를 고려할 필요 없이 각 언어에서 제공하는 redis 라이브러리를 사용하여 publish method를 이용하면 간단하다.

예를 들면 다음과 같다.

<img width="650" alt="스크린샷 2021-12-24 오후 4 51 14" src="https://user-images.githubusercontent.com/48988862/148213805-35897441-658c-4507-9879-1887fb0477a3.png">

**Subscribe**

위에 작성했다시피 Graphql에서는 이런 실시간 서비스를 쉽게 구현할 수 있도록 Subscription이라는 Operation type이 존재하고 [graphql-redis-subscriptions](https://github.com/davidyaha/graphql-redis-subscriptions) redis 전용 asyncIterator 구현체도 이미 존재한다.

따라서 해당하는 언어의 asyncIterator 구현체를 먼저 찾은 뒤에 위의 메시지 채널과 일치하게 구독하게 하면 된다.

예를 들면 다음과 같다

<img width="700" alt="스크린샷 2021-12-24 오후 4 54 48" src="https://user-images.githubusercontent.com/48988862/148213914-1774d53e-f8ca-470e-bedb-0d5af4a94e9c.png">

*참고로 graphql subscription에선 메시지의 이름이 publish의 key와 같아야 한다*





### Architecture

위를 적용한 아키텍쳐는 다음과 같다.

*참고로 각 언어마다 redis 구현체가 존재하므로 프레임워크는 중요하지 않다.*

<img width="1826" alt="스크린샷 2021-12-24 오후 6 07 39" src="https://user-images.githubusercontent.com/48988862/148213983-2f8d83a9-fa92-42ee-8dac-a0ee1a8697a4.png">



### TEST

<video width="650"src="https://user-images.githubusercontent.com/48988862/148215081-5596d195-0463-488a-8d8e-ec303fcc1a9e.mov
"></video>

**알림을 두번 Publish 했을 때 실시간으로 두개의 알림이 도착**하는 영상

