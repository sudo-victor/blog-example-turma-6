## Entidades

User {
  nickname: string
  email: string
  password: string
}

Post {
  content: string
  author: User
  likeAmount: number
}

## Use cases

1. Cadastrar um usuário
   1. Deve ser informado o nickname, email e password
   2. Nao deve cadastrar um usuário com uma senha menor ou igual a 6
   3. Nao deve cadastrar um usuário com o mesmo nickname
   4. Nao deve cadastrar um usuário com o mesmo email
2. Login com usuário
   1. Deve ser informado o email e a senha
   2. Nao deve logar caso o email nao exista
   3. Nao deve logar caso a senha esteja incorreta
   4. Deve retornar a credencial caso esteja tudo certo
3. Criar um post
   1. Deve ser possível criar um post, informando: content, author
   2. Nao deve ser possível criar um post com o conteudo vazio
   3. Nao deve ser possível criar um post sem um author
4. Incrementar o like
5. Decrementar o like

## Configuracao

[x] - Node
[x] - Typescript
[x] - Variaveis de ambiente
[x] - Banco de dados
[x] - Servidor(Express)

## Dúvidas

[x] - Yup
[x] - Criptografia de senha
[x] - Auth/Authorization (Token)
[ ] - Interface do schema no mongoose
[ ] - Relacionamentos
[ ] - Arquitetura e organizacao do código

Por onde eu comeco?

- Pegar alguma funcionalidade e ir criando as coisas baseado nela
  


Destinatarios
Assunto
Corpo

BODY -> Corpo -> A info principal
HEADERS -> Cabecalho -> Sao informacoes adicionais que o cliente passa para o servidor, por exemplo: Qual é o navego, qual é o formato de dados
PARAMS
QUERY