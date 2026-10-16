# Registro de Alterações — EasyFood

## 1. Exclusão de prato cadastrado incorretamente

**Data:** 16/10/2026

**Módulo:** Restaurantes e pratos

**Tipo:** Correção de dados

### Contexto

Durante a validação do cadastro de pratos, foi identificado que o prato *Classic Burger* estava associado incorretamente ao restaurante Taverna Portuguesa.

O prato correto já existia no restaurante Burger House e deveria permanecer associado a ele.

### Ação realizada

Foi utilizado o Prisma Studio para excluir somente o registro incorreto da tabela `Dish`, após a identificação do prato e a conferência de seu identificador e vínculo com o restaurante.

- **Prato excluído:** Classic Burger
- **ID do prato:** 3
- **ID do restaurante associado incorretamente:** 3 — Taverna Portuguesa

### Validação do resultado

Após a exclusão, a aplicação foi iniciada novamente e a página principal foi carregada com sucesso.

Foram conferidos os seguintes resultados:

- Taverna Portuguesa permaneceu com o prato Bacalhau à Brás.
- Burger House permaneceu com o prato Classic Burger.
- Os demais restaurantes e pratos continuaram sendo exibidos.
- A sessão do usuário continuou funcionando.

### Observação técnica

A exclusão foi realizada diretamente pelo Prisma Studio. Embora uma rota `DELETE` tenha sido implementada no módulo de pratos, seu funcionamento pela API ainda precisa ser validado separadamente, incluindo a autenticação e as respostas HTTP.

Também deve ser verificado se a exclusão direta pelo Prisma Studio gerou algum registro de auditoria. A operação realizada fora da API não executa automaticamente o serviço de registro de atividades da aplicação.

### Resultado

O cadastro incorreto foi removido sem excluir o prato válido do Burger House ou os demais registros dos restaurantes.

---

## 2. Próximas validações

- [ ] Testar a rota `DELETE /restaurants/:restaurantId/dishes/:id` pela API.
- [ ] Verificar o comportamento da rota com autenticação válida e inválida.
- [ ] Validar a resposta HTTP `204` para exclusão bem-sucedida.
- [ ] Validar a resposta HTTP `404` quando o prato não existir ou não pertencer ao restaurante informado.
- [ ] Confirmar o registro de auditoria para exclusões realizadas pela API.git status