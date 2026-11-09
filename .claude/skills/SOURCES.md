# Origem das skills

Skills de terceiros copiadas para este repositório. Revisadas manualmente antes da cópia
(sem padrões de exfiltração, acesso a credenciais ou `curl | sh` nos arquivos das skills).

| Skill(s) | Repositório | Commit | Licença | Dependência externa |
|---|---|---|---|---|
| ponytail, ponytail-audit, ponytail-debt, ponytail-gain, ponytail-help, ponytail-review | DietrichGebert/ponytail | 96608e0 | MIT | nenhuma (hooks do plugin não instalados) |
| lemo-opuscar | lemomo-ai/lemo-opuscar | 143f387 | MIT | `scripts/setup.sh` clona a biblioteca em `~/lemo-opuscar` e instala deps Node/Python no primeiro uso |
| agent-reach | Panniantong/Agent-Reach | c70ae6d | MIT | CLI `agent-reach` (pacote Python) + logins/cookies por plataforma |
| skill-inspector | NVIDIA/SkillSpector | e48d771 | Apache-2.0 | CLI `skillspector` |

FreeLLMAPI (tashfeenahmed/freellmapi), também citado no vídeo de origem, não é uma skill:
é um servidor proxy para APIs gratuitas de LLM e deve rodar na máquina local.
