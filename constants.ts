
export const LOTTERY_ANALYSIS_TEXT = `Relatório de Análise Estatística de Loterias
Analista: Especialista Matemático Sênior
Base de Dados:
mega_sena_asloterias_ate_concurso_2936_sorteio.csv (Aprox. 2.936 concursos)
quina_asloterias_ate_concurso_6870_sorteio.csv (Aprox. 6.870 concursos)
loto_facil_asloterias_ate_concurso_3530_sorteio.csv (Aprox. 3.530 concursos)
loto_mania_asloterias_ate_concurso_2844_sorteio.csv (Aprox. 2.844 concursos)

1. Mega-Sena (Universo: 60 números)
1.1. Probabilidades (Jogo Simples de 6 números)
A probabilidade de acertar as 6 dezenas sorteadas com um único cartão de 6 números é calculada pela combinação C(60, 6).
Sena (6 acertos): 1 em 50.063.860
Quina (5 acertos): 1 em 154.518
Quadra (4 acertos): 1 em 2.332

1.2. Números Mais Sorteados (Análise de Frequência)
Com base nos 2.936 concursos analisados, a frequência média esperada por número é de aproximadamente 293,6 aparições (2936 * 6 / 60). Números que aparecem significativamente acima ou abaixo desta média são estatisticamente notáveis.
Top 6 Números Mais Frequentes (Histórico): 10, 53, 05, 42, 37, 23
Top 6 Números Menos Frequentes (Histórico): 26, 21, 15, 22, 09, 55

1.3. Repetições de Jogos Inteiros
Após a análise combinatória dos 2.936 resultados da Mega-Sena (onde a ordem das dezenas é irrelevante), não foi encontrada nenhuma repetição de um jogo completo (as 6 dezenas sorteadas).
Conclusão Matemática: Isso é estatisticamente esperado. A probabilidade de um resultado específico se repetir é idêntica à de qualquer novo resultado (1 em 50 milhões), tornando eventos de repetição completos extremamente raros no período de tempo analisado.

2. Quina (Universo: 80 números)
2.1. Probabilidades (Jogo Simples de 5 números)
A probabilidade de acerto é calculada pela combinação C(80, 5).
Quina (5 acertos): 1 em 24.040.016
Quadra (4 acertos): 1 em 64.106
Terno (3 acertos): 1 em 866
Duque (2 acertos): 1 em 36

2.2. Números Mais Sorteados (Análise de Frequência)
Com base nos 6.870 concursos analisados, a frequência média esperada por número é de aproximadamente 429,4 aparições (6870 * 5 / 80).
Top 5 Números Mais Frequentes (Histórico): 04, 49, 31, 52, 39
Top 5 Números Menos Frequentes (Histórico): 03, 70, 80, 65, 07

3. Lotofácil (Universo: 25 números)
3.1. Probabilidades (Jogo Simples de 15 números)
A probabilidade de acerto é calculada pela combinação C(25, 15).
15 acertos: 1 em 3.268.760
14 acertos: 1 em 21.791
13 acertos: 1 em 691
12 acertos: 1 em 59
11 acertos: 1 em 11

3.2. Números Mais Sorteados (Análise de Frequência)
Com base nos 3.530 concursos analisados, a frequência média esperada por número é de aproximadamente 2.118 aparições (3530 * 15 / 25).
Top 5 Números Mais Frequentes (Histórico): 20, 10, 11, 25, 13
Top 5 Números Menos Frequentes (Histórico): 08, 15, 21, 06, 04

Advertência Final do Especialista:
Esta análise é um retrato do passado. A teoria das probabilidades sustenta que eventos futuros não são influenciados por resultados passados (a "Falácia do Jogador"). Use esta análise como uma ferramenta de estudo para entender o comportamento histórico dos sorteios, não como um método de previsão. A sorte é, por definição, imprevisível.
`;
