# O link que vai na mensagem automática do WhatsApp

Ela disse que essa é a parte que mais pega: quem chama no WhatsApp precisa
receber, sozinho, um link que leve ao formulário. A mensagem automática ela
configura em dois minutos no WhatsApp Business. O que faltava era o link.

---

## Por que a plataforma não sobe no Netlify

O Netlify serve arquivos estáticos. Esta plataforma não é estática.

A LP não é um `.html` que se copia: ela é montada no servidor pelo Apps Script
(`doGet` → `HtmlService.createTemplateFromFile`), e o formulário envia por
`google.script.run` — uma chamada que só existe dentro da página servida pelo
próprio Apps Script. Fora dali, `google.script.run` é `undefined` e o botão
"Enviar" não faz nada.

E o que está atrás do formulário também não vai: `SpreadsheetApp` (o banco de
dados), `GmailApp` (os e-mails), `CalendarApp` (a agenda), `DriveApp` (as pastas
dos clientes). Nada disso existe no Netlify. Reescrever para lá significaria
banco de dados hospedado, servidor de e-mail e credenciais de API — assinatura
mensal e a garantia de custo zero por terra.

O mesmo vale para o link direto do GitHub. E, no caso do GitHub, há um segundo
motivo: publicar a partir do repositório expõe o código-fonte do que você vende.
O repositório é privado, e deve continuar.

**A plataforma continua no Apps Script. O Netlify entra em outro papel.**

---

## A solução: o Netlify como redirecionador

O link feio continua existindo e continua sendo o endereço real. O que muda é o
endereço que ela divulga.

```
atendimento.polianaespolador.adv.br   →   script.google.com/macros/s/AKf.../exec
```

O Netlify hospeda um site com **um único arquivo** — nenhuma linha do código do
projeto sai do repositório privado:

**`_redirects`**
```
/*   https://script.google.com/macros/s/COLAR_O_ID_DA_IMPLANTACAO/exec   302
```

Passo a passo:

1. Criar uma pasta com esse único arquivo `_redirects`
2. Arrastar a pasta para o Netlify (*Sites → Add new site → Deploy manually*)
3. *Domain settings* → *Add custom domain* → `atendimento.polianaespolador.adv.br`
4. No provedor do domínio dela, criar o `CNAME` que o Netlify indicar
5. O certificado HTTPS é emitido sozinho, em minutos

Custo: R$ 0. Plano gratuito do Netlify, e ela já tem o domínio.

### Por que 302 e não 301

O 301 é cacheado pelo navegador de forma agressiva e é difícil de reverter. Se
a URL da implantação mudar, quem já abriu o link uma vez continuaria indo para o
endereço antigo. O 302 permite trocar o destino a qualquer momento.

### Um cuidado que mantém o link vivo

A URL `/exec` **só muda se alguém criar uma implantação nova**. Republicar como
*Nova versão* da implantação existente mantém a mesma URL para sempre.

> **Implantar → Gerenciar implantações → lápis → Nova versão → Implantar.**
> Nunca "Nova implantação".

Se um dia isso acontecer por engano, não há nada perdido: basta trocar a URL
dentro do `_redirects` e reenviar a pasta. O endereço divulgado não muda.

---

## Alternativa sem Netlify

Se o domínio dela estiver num provedor que já oferece redirecionamento de
subdomínio (a maioria oferece), dá para fazer direto lá, sem Netlify nenhum.
Mesmo resultado, um serviço a menos no meio. Vale checar antes.

---

## A mensagem automática

Com o link pronto, no WhatsApp Business dela:
**Configurações → Ferramentas comerciais → Mensagem de ausência** (ou *Mensagem
de saudação*, para responder a todo primeiro contato).

Sugestão de texto — direta, sem prometer prazo que ela não controla:

> Olá! Aqui é do escritório de Poliana Espolador, advocacia previdenciária.
> Recebi sua mensagem e vou responder assim que possível.
>
> Para adiantar, você pode me contar seu caso por aqui, em 2 minutos:
> atendimento.polianaespolador.adv.br
>
> Assim eu já chego na nossa conversa com o seu caso lido.

O formulário tem duas portas, caso ela queira separar os públicos:

- `...adv.br/?tipo=inss` — pula a pergunta de vínculo, vai direto ao INSS
- `...adv.br/?tipo=servidor` — entra pela trilha do servidor público
