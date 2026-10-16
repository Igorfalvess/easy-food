# ADR 001: Separação do Processamento de Imagens via FaaS

## 1. Contexto e Problema
O EasyFood precisa suportar o cadastro de pratos com imagens enviadas pelos restaurantes. As imagens originais chegam com tamanho elevado (~12 MB), o que sobrecarregaria a API principal e o banco de dados se fossem processadas sincronicamente no monólito.

## 2. Decisão Arquitetural
Optamos por desacoplar o processamento de imagens da API principal utilizando uma abordagem baseada em eventos e **FaaS (Function as a Service)**. 
- A API principal recebe a requisição, persiste os dados textuais e armazena a imagem original.
- Um evento de upload dispara uma função isolada na nuvem responsável por redimensionar e otimizar a imagem (~300 KB).

## 3. Alternativas Consideradas
- **Processamento síncrono na API:** Descartado devido ao alto consumo de CPU/memória e ao aumento da latência para o usuário (tempo de espera elevado).
- **Processamento em background worker tradicional:** Viável, mas exige gerenciamento contínuo de infraestrutura (servidores ligados), ao contrário do FaaS que escala sob demanda.

## 4. Consequências
- **Positivas:** Redução da carga na API principal, melhoria na experiência do usuário (resposta rápida) e escalabilidade automática do processamento.
- **Negativas / Desafios:** Introdução de complexidade assíncrona e atenção ao efeito *Cold Start* das funções serverless.