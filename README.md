# 🎮 Campainha Digital - Game Show

Sistema de campainha digital em tempo real para competições em formato de Game Show, onde grupos competem para responder perguntas sendo o mais rápido a apertar o botão.

## 🎯 Funcionalidades

- ✅ **Sessão única** com QR Code para acesso fácil
- ✅ **4 Grupos**: Alpha, Bravo, Charlie e Delta
- ✅ **Tempo real** usando Server-Sent Events (SSE)
- ✅ **Interface do Apresentador** para controlar a sessão
- ✅ **Interface dos Participantes** responsiva para mobile
- ✅ **Sons e animações** ao apertar o buzzer
- ✅ **Detecção de primeiro a responder** com precisão de milissegundos
- ✅ **Deploy fácil na Vercel**

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Server-Sent Events (SSE)** para comunicação em tempo real
- **QRCode.react** para geração de QR codes

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 🎮 Como Usar

### 1. Apresentador
- Acesse a página inicial e clique em **"Apresentador"**
- Uma nova sessão será criada automaticamente
- Compartilhe o QR Code com os participantes
- Veja quais grupos estão conectados em tempo real
- Clique em **"Liberar Respostas"** quando fizer uma pergunta
- O primeiro grupo a apertar o botão será mostrado na tela
- Use **"Resetar Rodada"** para preparar a próxima pergunta

### 2. Participantes
- Escaneie o QR Code ou acesse a página inicial e clique em **"Participante"**
- Escolha qual grupo você representa (Alpha, Bravo, Charlie ou Delta)
- Aguarde o apresentador liberar as respostas
- Seja o mais rápido a apertar o **BUZZ!**
- Se você for o mais rápido, sua tela mostrará a vitória! 🎉

## 🎨 Grupos e Cores

- **Alpha** - Vermelho
- **Bravo** - Azul
- **Charlie** - Verde
- **Delta** - Amarelo

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🌐 Deploy na Vercel

### Opção 1: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Opção 2: Deploy via GitHub

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe seu repositório
4. A Vercel irá detectar Next.js automaticamente
5. Clique em "Deploy"

### Configurações Importantes para Vercel

O projeto já está configurado corretamente. A Vercel irá:
- Detectar Next.js automaticamente
- Instalar as dependências
- Fazer o build
- Deploy em poucos segundos

**Nota:** O SSE (Server-Sent Events) funciona perfeitamente na Vercel usando Edge Functions.

## 🏗️ Arquitetura

```
/app
  /api
    /events/route.ts      # SSE endpoint para atualizações em tempo real
    /session/route.ts     # Gerenciamento da sessão
    /buzz/route.ts        # Registro de buzzers
  /host/page.tsx         # Interface do apresentador
  /player/page.tsx       # Interface dos participantes
  page.tsx               # Página inicial

/components
  QRCodeDisplay.tsx      # Componente de QR Code
  TeamSelector.tsx       # Seletor de grupos
  BuzzButton.tsx         # Botão de buzz

/lib
  types.ts               # Definições TypeScript
  session.ts             # Gerenciador de estado da sessão
```

## 🔧 Como Funciona

1. **Estado em Memória**: Como você precisa apenas de uma sessão simultânea, o estado é gerenciado em memória no servidor
2. **Server-Sent Events**: Mantém uma conexão persistente servidor → cliente para atualizações instantâneas
3. **Timestamp Precision**: Usa `Date.now()` para determinar com precisão quem apertou primeiro
4. **Sincronização Automática**: Todas as telas (apresentador e participantes) são sincronizadas automaticamente

## 📝 Melhorias Futuras

- [ ] Adicionar suporte para múltiplas sessões simultâneas
- [ ] Histórico de rodadas
- [ ] Estatísticas por grupo
- [ ] Sons customizáveis
- [ ] Temas personalizados
- [ ] Modo de eliminação
- [ ] Pontuação acumulada

## 📄 Licença

MIT

## 👨‍💻 Desenvolvimento

Desenvolvido com Next.js 14 e TypeScript para USJT 2026.

---

**Divirta-se com seu Game Show! 🎉**
