---
title : "터미널에서 파이썬 설치 및 실행하기 (bash,zsh)"
excerpt : "가상환경 설치와 사용 방법을 알아본다"
categories : 
  - python
tags :
  - python
  - pyenv
  - virtualenv
  - pyenv local
toc : true
toc_sticky : true
last_modified_at : 2020-02-07 18:51:00
---

### 개요
파이썬 가상환경 pyenv는 매번 사용함에도 불구하고 항상 깜빡해서 다른 블로그들을 참조했다.  
한번 머리속에 정리하고 다음에 필요할 때마다 내 블로그를 참조하면 좋을 것 같아서 정리한다.  

---
### 왜 파이썬 가상환경을 설치하는가?
맥의 경우, 파이썬을 설치하지 않아도 기본 2버전이 설치되어있다.  
이번 크롤링은 3.7.4버전을 설치해서 이용해보도록 하겠다.  
나의 경우엔 프로젝트마다 파이썬 버전이 다를 수 있다는 것을 기반에 두기 때문에, pyenv-virtualenv라는 가상환경으로 매번 새로운 환경을 만들어준다.  
나는 현업을 해보진 않았지만 많은 사람들이 권장하는 방법이므로 이 글을 보는 사람들도 시스템 환경에 설치하지 않고, **매번 새로운 환경에 설치하는 방법**으로 하길 권장한다.  
쉬운 예시를 들면, 
>A 프로그램에서는 그림그리기 버전2 라이브러리를 사용하고  
>B 프로그램에서는 그림그리기 버전1 라이브러리와 그래프그리기 라이브러리를 사용할 것이다.  

이렇게 되면 한 컴퓨터에서 두 프로그램을 동시에 개발할 때 삭제, 설치를 반복해야하므로 매우 불편하다.  

사실 파이참같은 통합개발환경을 사용하면 매번 자동으로 가상환경이 만들어지고, 인터프리터를 시스템환경으로 바꿀 수 있는 것이 큰 장점이지만 나는 그 과정들을 이해하는 것과 사실 쉘에서 모든 것을 해결한다는 편함때문에 쉘을 많이 사용한다.  

---
일단 파이썬을 설치해야한다. 일반 사용자의 경우 파이썬 공식 홈페이지에 들어가서 설치하겠지만, 우리는 매번 가상환경을 사용하기로 했으므로 pyenv를 이용하겠다. 
### brew 설치 
패키지 관리자(homebrew)를 사용할 것이므로 homebrew부터 설치한다. 패키지 관리자는 나중에 따로 포스팅하도록 하겠다.
<https://brew.sh/index_ko> 에 들어가서 Homebrew설치하기 밑에 있는 코드

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

를 자신이 사용하고 있는 터미널에 붙여넣기한다.
(일반적인 Mac OS터미널의 경우 bash일 것이다. 자신이 좀 더 관심이 있다면 zsh, ITerm2 등을 설치하면 좋다. 이 부분은 생략하겠다.)  

### pyenv 설치
이제 터미널을 껐다 킨 후(_brew 명령어가 듣지 않을 수도 있다._), brew명령어를 이용해 pyenv를 설치한다.  

```bash
brew install pyenv
```  

이제 자신이 원하는 파이썬 버전을 필요할 때마다 설치할 수 있다.  
pyenv 업그레이드 해준다.  

```bash
brew upgrade pyenv
```   

### 환경변수 설정
환경변수를 설정해준다. (pyenv 명령어를 어디에서나 사용할 수 있게 만들어주는 과정이라고 생각하면 쉽다. )  

```bash
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zhsrc
$ echo 'eval "$(pyenv init -)"' >> ~/.zshrc
$ source ~/.zshrc
```  
_bash터미널을 사용한다면 끝에 ~/.zshrc를 ~/.bash\_profile 로 바꾸어 주어야 한다._

### 파이썬 설치

```bash
pyenv install -l
```
를 입력해본다.
[이미지]
처럼 리스트가 뜨면 성공이다.  
나의 경우엔 3.7.4버전을 설치할 것이므로 다음을 입력해준다.  

```bash
pyenv install 3.7.4
```  
 
잘 설치되있는지 확인해본다.  

```bash
$ pyenv versions
```

3.7.4가 나오면 성공이다.  

### 파이썬 가상개발환경 만들기

virtualevn를 설치한다.  

```bash
$ brew install pyenv-virtualenv

$ echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
$ source ~/.zshrc
```

가상환경을 만들고 실행한다.  

```bash
$ pyenv virtualenv 3.7.4(원하는파이썬버전) web_crawler(내가 원하는 가상환경 이름)
$ pyenv versions # 잘 추가되었는지 확인한다.
$ pyenv activate web_crawler  # 가상환경 실행
$ pyenv deactivate # 가상환경 끄기
```

### 자동으로 가상환경 키기

나는 매번 폴더에 들어갈 때마다 실행하기가 귀찮아서, 그 폴더에 들어가면 자동으로 가상환경이 켜지게 하는데, 이는 pyenv local로 해결한다.  

```bash
pyenv local web_crawler
```

이렇게 하고 다시 그 폴더를 들어가면 자동으로 켜지는 것을 확인할 수 있다.  

### 파이썬 파일 실행해보기

파이썬 파일을 만들어본다

```bash
vi example.py
```

example.py

```python
#!/usr/bin/env python
import sys

print(sys.version)
print("hello world")

```

사실 첫줄이 가장 중요한데, 저렇게 적으면 가상환경 파이썬,

```python
#!/usr/bin/python
```

은 시스템 파이썬이라는 사실만 알아두자. 

파이썬을 실행파일로 만든 뒤 실행해보자.

```bash
$ chmod +x example.py
$ ./example.py
```

이 글을 잘 따라했다면 밑과 같은 결과를 얻을 것이다.
[이미지]


### 웹에서 정보 가져오기
> [!IMPORTANT]  
>내 컴퓨터 환경 : Mac OS, Unix, zsh  
>Reference : [나만의 웹 크롤러 만들기]("https://beomi.github.io/gb-crawling/")  

크롤링을 하게 된 이유
최근에 자동화에 대한 관심이 생겨서.
크롤링은 인터넷 상에 있는 자료들을 가져와 프로그래밍 혹은 데이터 분석하기가 가능한 형태로 가공하는 작업이다.  
나는 두가지 다 관심이 있는데 먼저 해보려고 하는 것은 프로그래밍이다.  
[나만의 웹 크롤러 만들기]("https://beomi.github.io/gb-crawling/")를 참고하여 간단한 웹 크롤러 작업 환경을 구성해보겠다.  
Mac Os, 그중 zsh(bash)환경으로 많은 부분을 해결하고 싶은 초보 개발자에게 많은 도움이 될 것 같다.
