# 규칙 문서 만들기

server는 controllers / dao / db로 나눌 예정

dao는 table 단위로 파일을 생성할 예정
controller는 초기에는 table 단위로 생성하다가, 이후 뚜렷한 도메인이 보이면 하나의 도메인으로 합치는 과정을 생각 중
db는 public 접근과 admin 접근이 있음
public 접근은 app > api > (public) 라우트 그룹에서 사용하고
admin 접근은 app > api > (admin) 라우트 그룹에서 사용할 생각

이런 방향으로 개발할 건데 잠재적인 위험이나, 추가해야 할 규칙이 있으면 알려줘

이 내용을 기반으로 규칙문서도 하나 작성해줘줘
