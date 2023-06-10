# Login

> ## Caso de sucesso

1. ✅ Valida dados obrigatórios: **username** e **password**
2. ⛔️ Valide se existe uma conta para o usuário informado.
3. ⛔️ Valide se a senha é igual a armazenada no banco de dados para este usuário.
4. ⛔️ Retorna um token de acesso.

> ## Exceções

1. ✅ Retorna erro **400** se username ou password não forem fornecidos pelo client
2. ⛔️ Retorna erro **403** se senha for inválido
3. ⛔️ Retorna erro **404** se usuãrio não for um usuãrio registrado
4. ⛔️ Retorna erro **500** se der erro ao tentar verificar os dados do usuãrio
