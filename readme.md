# Service do Organzier-angular

- Em fase de desenvolvimento inicial do projeto

### endpoints
- Por enquanto todos os endpoints estão usando o método **POST**

#### '/login'
- Enviar o user e password no body da requisição para retornar as informações do usuário

#### '/cadastrar'
- Enviar os dados para cadastrar no body da requisição e retorna os dados do usuário já cadastrado
enviar: user, password, email e name
```json
{
	"user": "teste00",
	"password": "teste",
	"email": "teste@teste.com",
	"name": "Name Teste"
}
```

#### '/atualizar'
enviar os dados user e password para poder verificar os dados e pode atualizar o name e email

```json
{
	"user": "teste00",
	"password": "teste",
	"email": "teste@teste.com",
	"name": "Name Teste"
}
```

### Endpoints Autenticados (necessitam que evie o token no header 'token')

#### /auth/get-data

- precisa apenas enviar o token no header que retorna um objeto com id do usuário e todos os itens dele

```json
{
	"userId": "6067190b2781a633ac42bef2",
	"objects": [
		{
			"id": "1",
			"title": "Novo Card",
			"description": "Descrição do card",
			"type": "card",
			"date": "2022-01-16T19:48:07.824Z",
			"theme": "default"
		},
		{
			"id": "2",
			"title": "Novo Calendário",
			"description": "Descrição do Calendário",
			"type": "calendarMonth",
			"date": "2022-01-16T19:48:07.824Z",
			"theme": "default"
		}
	]
}
```

#### /auth/update-data

- Mandar o objects para atualizar e o token no header o retorno é igual ao de cima, porém com os objetos atualizado

```json
{
	"userId": "6067190b2781a633ac42bef2",
	"objects": [
		{
			"id": "1",
			"title": "Novo Card",
			"description": "Descrição do card",
			"type": "card",
			"date": "2022-01-16T19:48:07.824Z",
			"theme": "default"
		},
		{
			"id": "2",
			"title": "Novo Calendário",
			"description": "Descrição do Calendário",
			"type": "calendarMonth",
			"date": "2022-01-16T19:48:07.824Z",
			"theme": "default"
		}
	]
}
```