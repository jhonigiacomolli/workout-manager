# Atualização de Cadastro

> ## Caso de sucesso

1. ✅ Valida que o **accessToken** foi enviado no header
2. ✅ Valida que o **accessToken** é um token valido
3. ✅ Valida dados obrigatórios: **id**, **name**, **email**
4. ✅ **Atualiza** a conta do usuário com os dados informados
5. ✅ **Verifica** se os dados foram gravados corretamente no banco de dados
6. ✅ Retorna **200** se a atualização for bem sucedida

> ## Exceções

1. ✅ Retorna erro **403** se o accessToken não for enviado no header
2. ✅ Retorna erro **403** se o accessToken fornecido for inválido
3. ✅ Retorna erro **400** se id, name, ou email não forem fornecidos pelo client
4. ✅ Retorna erro **400** se o id não for um id valido
5. ✅ Retorna erro **500** se der erro ao ao verificar accessToken
6. ✅ Retorna erro **500** se der erro ao tentar atualizar a conta do usuário
