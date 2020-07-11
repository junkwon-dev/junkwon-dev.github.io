---
title : "PostgreSQL 설치"
excerpt : "프로젝트 createTrend에 필요한 데이터베이스를 설치하면서 필요했던 과정을 정리하고 기록한다."
categories : 
  - blog
tags :
  - blog
  - Database
  - PostgreSQL
  - DevOps
  - Documentation
  - server
toc : true
toc_sticky : true
last_modified_at : 2020-07-11  21:00



---

### 개요

Software Maestro 과정 중 createTrend 프로젝트에서 사용하는 관계형 데이터베이스 PostgreSQL에 대한 문서이다.

### PostgreSQL을 사용하는 이유

createTrend 프로젝트 특성 중, 대용량 데이터 처리가 필요한 부분 때문에 Hadoop을 고려했다. 멘토링 후 Hadoop까지는 over spec이라 생각되어 대용량 처리에 유리하고 오픈소스 RDB인 PostgreSQL을 선택했다.

### 설치

다음 명령어를 통해 사용 가능한 postgresql 버전을 확인한다.

```bash
sudo apt show postgresql
```

사용 가능한 postgresql을 설치하려면 다음 명령어를 사용한다.

postgresql과 postgresql-contrib의 차이 : 후자가 추가 유틸리티와 기능이 더 깔린다.

*다른 버전을 깔고 싶다면 패키지 레파지토리를 따로 검색해야한다.*

```bash
sudo apt install postgresql-contrib
```

설치가 잘 되었는지 확인해본다.

```bash
service postgresql status
```

### 외부접속 설정하기

Postgresql은 default로 외부 접속을 막는다. 외부에서 접속 가능하게 설정 변경을 한다.

파일의 위치: /etc/postgresql/12/main/postgresql.conf

listen_address를 찾아 주석을 없애고 listen_addresses = '*'로 바꾸어준다.

파일의 위치: /etc/postgresql/12/main/pg_hba.conf

IPv4 local connection을 찾아 127.0.0.1/32가 아닌 0.0.0.0/0으로 바꾸어준다.

모두 바꾼 뒤 서비스를 재시작한다.

```bash
sudo service postgresql restart
```

출처: [Simple is Beautiful.](https://www.smoh.kr/299?category=706280)

❗️주의점 : 후에 보안상 위험할 수 있으므로 적절한 시기에 외부접속 설정을 다시 해준다.

### AWS 보안그룹 인바운드 설정하기

아마존 웹 서비스로 서비스를 만드는 경우엔, 보안그룹에 인바운드 규칙을 추가해주어야 외부에서 접속이 가능하다.

<img width="1332" alt="스크린샷 2020-07-11 오후 6 53 20" src="https://user-images.githubusercontent.com/48988862/87221639-7b5f8100-c3a8-11ea-891e-c299b1a47dab.png">

다음과 같이 규칙을 추가해준 뒤 규칙 저장을 누르면 설정 완료된다.

❗️주의점 : ssh 접속을 삭제하면 접속이 불가하므로 만약 삭제했다면 SSH 규칙을 추가해주자.

### 데이터베이스, 사용자 생성

DB와 User 설정을 해본다.

```bash
sudo su postgres
```

```bash
psql
```

사용할 DB를 생성한다.

```sql
CREATE DATABASE test;
```

<img width="459" alt="스크린샷 2020-07-11 오후 7 15 52" src="https://user-images.githubusercontent.com/48988862/87221972-fcb81300-c3aa-11ea-8b63-7a896b43a5ce.png">

유저를 생성하고 권한을 부여한다.

개발용 계정으로 superuser 권한을 부여한다.

```sql
CREATE USER {username} WITH PASSWORD '***';
ALTER USER {username} WITH SUPERUSER
```

출처: [Simple is Beautiful.](https://www.smoh.kr/299?category=706280)

### 외부에서 접속해보기

각자가 사용하는 DB Client tool로 접속해본다.

나는 DBeaver 툴을 사용하였다.

<img width="1552" alt="스크린샷 2020-07-11 오후 7 04 15" src="https://user-images.githubusercontent.com/48988862/87221770-8e268580-c3a9-11ea-8d45-e36dc875f17f.png">

왼쪽 상단의 new connection을 누르고, PostgreSQL, 드라이버 설치를 완료한 뒤 다음과 같이 설정한다.

<img width="781" alt="스크린샷 2020-07-11 오후 7 22 40" src="https://user-images.githubusercontent.com/48988862/87222111-0726dc80-c3ac-11ea-8a95-297ff9c7c1f2.png">

Test connection으로 연결 확인을 한 뒤 완료버튼을 누른다.

<img width="191" alt="스크린샷 2020-07-11 오후 7 25 18" src="https://user-images.githubusercontent.com/48988862/87222135-481ef100-c3ac-11ea-98b2-1ef6c4975e3e.png">

연결이 잘 되면 성공이다.







