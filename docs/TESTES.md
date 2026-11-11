# Roteiro de verificação manual

Este documento descreve cenários para executar no navegador. Não é um relatório de testes já aprovados nem uma suíte automatizada.

## Preparação

1. Execute o projeto conforme o [README](../README.md#como-executar).
2. Use dados fictícios, como `demo@example.com` e uma senha demonstrativa com pelo menos oito caracteres.
3. Abra o console do navegador para acompanhar possíveis erros.
4. Recarregue a página entre cenários que precisem do estado inicial.

## Cenários

| ID | Ação | Resultado esperado pelo código atual |
| --- | --- | --- |
| 01 | Abrir a página inicial. | Exibir 3 produtores, 6 produtos, 3 municípios e 1 encomenda aberta. |
| 02 | Abrir Produtos e alternar o preço de loja. | Exibir atacado e mínimo quando disponíveis; morango não possui preço de atacado. |
| 03 | Abrir o morango no modo de loja. | Exibir o botão de compra indisponível para lojas. |
| 04 | Abrir uma vitrine pela lista de produtores. | Mostrar os produtos vinculados ao produtor escolhido. |
| 05 | Tentar enviar pedido sem login. | Mostrar aviso e direcionar para a tela Entrar. |
| 06 | Cadastrar nome válido, e-mail, perfil e senhas iguais com 8 ou mais caracteres; aceitar os termos. | Criar usuário temporário e abrir o painel. |
| 07 | Cadastrar senhas diferentes. | Exibir aviso de divergência. |
| 08 | Entrar com e-mail fictício válido e senha de 8 caracteres. | Abrir painel de consumidor, sem consultar cadastro prévio. |
| 09 | Clicar em Simular uma compra. | Criar visitante se necessário e abrir pedido de ovos. |
| 10 | Oferecer R$ 14 por uma dúzia de ovos no varejo. | Total de R$ 14 e progressão até Entregue em cerca de 16 segundos após o envio. |
| 11 | Oferecer R$ 10 por uma dúzia de ovos no varejo. | Recusa após cerca de 5 segundos por ficar abaixo de 85% do preço. |
| 12 | Informar quantidade acima do estoque ou abaixo do mínimo do atacado. | Impedir envio pelo formulário ou pela validação JavaScript. |
| 13 | Enviar proposta válida para a encomenda de alface. | Aumentar o contador de propostas e mostrar a proposta no painel. |
| 14 | Enviar pergunta com menos de 5 caracteres. | Exibir aviso de pergunta muito curta. |
| 15 | Enviar uma pergunta válida pela vitrine. | Exibir pergunta e resposta automática no painel após cerca de 6 segundos. |
| 16 | Sair da conta. | Limpar usuário, propostas e perguntas; retornar ao início. |
| 17 | Recarregar a página após interagir. | Restaurar o estado inicial, sem usuário autenticado. |
| 18 | Navegar pelos cartões de produtos com Tab e Enter ou Espaço. | Abrir o detalhe do cartão selecionado. |
| 19 | Conferir telas ampla e estreita, incluindo formulários e painel. | Verificar adaptação do layout e registrar qualquer sobreposição ou rolagem horizontal indevida. |

## Recursos ainda incompletos

Os links de recuperação de senha e do rodapé são ilustrativos. A publicação de encomendas e o cadastro de novos produtos não possuem fluxo completo. Essas limitações já estão registradas no README e não devem ser apresentadas como funcionalidades concluídas.

## Registro de execução

Ao executar o roteiro, registre data, navegador, cenário, resultado observado e evidência. Separe os cenários aprovados, reprovados e não executados. Para problemas, inclua passos de reprodução no relato da issue.
