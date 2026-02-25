<div align="center">

# 💬 ChatApp

**Real-time chat frontend — React 18 · TypeScript · Redux Toolkit · SignalR**

<br/>

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-0078D4?style=for-the-badge&logo=microsoft&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS_Variables-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<br/>

[![Build](https://img.shields.io/github/actions/workflow/status/chethankumblekar/ChatApp/node.js.yml?branch=master&label=build&style=flat-square&logo=github)](https://github.com/chethankumblekar/ChatApp/actions)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 📐 Architecture

> See [architecture](https://github.com/chethankumblekar/ChatService/blob/master/chatservice-architecture.svg) for the full interactive diagram.

```
App (Route Guard)
├── /login  → LoginPage → GoogleLoginButton (GSI renderButton)
└── /*      → HomePage
    ├── Sidebar          (nav + connection badge + logout)
    ├── ConversationList (search + recent conversations)
    └── ChatPanel        (topbar + messages + input)

Redux Store
├── authSlice   (user, isAuthenticated)
└── chatSlice   (conversations, messages, onlineUsers, connectionStatus)

SignalR (singleton hub)
└── useSignalR.ts → startHub / stopHub / useSignalRListeners

API Layer (fetch + JWT)
├── authApi.ts    → POST /api/auth/google
└── userApi.ts    → GET /conversations, /messages, /user?search=
```

---

## 🗂 Project Structure

```
ChatApp/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
│
├── public/
│   └── index.html
│
└── src/
    ├── index.tsx                   # Entry — Redux Provider + Router
    ├── App.tsx                     # Route guard (auth → Home, else → Login)
    │
    ├── config/
    │   └── index.ts                # API_BASE_URL, HUB_URL, HubEvents constants
    │
    ├── types/
    │   └── index.ts                # AuthUser, UserDto, MessageDto, ConversationDto
    │
    ├── utils/
    │   ├── token.ts                # getToken · setToken · clearToken (js-cookie)
    │   └── format.ts               # formatMessageTime · avatarColor · initials
    │
    ├── api/
    │   ├── apiClient.ts            # Base fetch with JWT header + ApiError class
    │   ├── authApi.ts              # googleAuth() → POST /api/auth/google
    │   └── userApi.ts              # getConversations · getMessages · getUsers · markRead
    │
    ├── store/
    │   ├── index.ts                # configureStore · RootState · AppDispatch
    │   └── slices/
    │       ├── authSlice.ts        # loginSuccess · logout · JWT hydration from cookie
    │       └── chatSlice.ts        # conversations · messages · presence · connectionStatus
    │
    ├── hooks/
    │   ├── useAppDispatch.ts       # Typed dispatch
    │   ├── useAppSelector.ts       # Typed selector
    │   └── useSignalR.ts           # startHub · stopHub · getHubConnection · useSignalRListeners
    │
    ├── components/
    │   ├── auth/
    │   │   └── GoogleLoginButton.tsx   # GSI renderButton (no FedCM, no prompt())
    │   ├── chat/
    │   │   ├── ConversationList.tsx    # Search + recent list + onStartNew
    │   │   ├── MessageBubble.tsx       # sent/recv + read receipts ✓✓
    │   │   ├── MessageInput.tsx        # auto-resize textarea, Enter=send
    │   │   └── TypingIndicator.tsx     # animated 3-dot, auto-dismiss 3s
    │   ├── layout/
    │   │   └── Sidebar.tsx             # nav + connection badge + avatar + logout
    │   └── ui/
    │       ├── Avatar.tsx              # color-hashed initials + online dot
    │       └── ConnectionBadge.tsx     # SignalR status dot
    │
    ├── pages/
    │   ├── Login/
    │   │   └── LoginPage.tsx           # login card with orb background
    │   └── Home/
    │       └── HomePage.tsx            # full chat interface + all hub wiring
    │
    └── assets/
        └── styles/
            └── global.css              # CSS variables + all component styles
```

---

## 🍎 Mac M2 Development Setup

### 1 — Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (Apple Silicon — /opt/homebrew not /usr/local)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2 — Node.js 20 (LTS)

```bash
# Option A — nvm (recommended — lets you switch versions)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zprofile
nvm install 20
nvm use 20
nvm alias default 20

# Option B — Homebrew
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zprofile

# Verify — must show arm64
node --version     # v20.x.x
node -p process.arch  # arm64
npm --version      # 10.x.x
```

### 3 — VS Code

```bash
brew install --cask visual-studio-code

# Recommended extensions for this project
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
```

### 4 — Git

```bash
brew install git

git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global pull.rebase true     # avoids divergent branch warnings
git config --global init.defaultBranch master
```

### 5 — React DevTools + Redux DevTools (Chrome)

Install both from the Chrome Web Store:

- **React Developer Tools** — inspect component tree, props, hooks
- **Redux DevTools** — time-travel debugging, view every dispatched action

---

## 🚀 Getting Started

### 1 — Clone and install

```bash
git clone https://github.com/chethankumblekar/ChatApp.git
cd ChatApp
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
REACT_APP_API_URL=https://localhost:7058
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

> ⚠️ Must start with `REACT_APP_` or CRA won't include them in the build.
> Restart `npm start` after any `.env.local` change.

### 3 — Run

```bash
npm start
# Opens http://localhost:3000
```

### 4 — Build for production

```bash
npm run build
# Output in ./build — deploy to Vercel, Netlify, S3, etc.
```

---

## 🔐 Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. **Authorised JavaScript origins** — add:
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```
5. Copy the **Client ID** → paste into `.env.local` as `REACT_APP_GOOGLE_CLIENT_ID`
6. **OAuth consent screen** → add your Google email as a **Test user**

> ℹ️ Google Sign-In uses `renderButton()` which renders an official iframe-based button. This avoids the FedCM `navigator.credentials.get` errors that occur with `prompt()`.

---

## ⚙️ Environment Variables

| Variable | Required | Example | Description |
|----------|:--------:|---------|-------------|
| `REACT_APP_API_URL` | ✅ | `https://localhost:7058` | ChatService API base URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | ✅ | `123456789.apps.googleusercontent.com` | Google OAuth 2.0 Client ID |

---

## 🔌 SignalR Integration

The hub is a **module-level singleton** — created once after login, destroyed on logout:

```
Login
  └── startHub()
        └── HubConnectionBuilder
              .withUrl(HUB_URL, { accessTokenFactory: getToken })
              .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
              .build()
              .start()

HomePage mounts
  └── useSignalRListeners()
        ├── hub.on("ReceiveMessage")   → dispatch(appendMessage)
        ├── hub.on("MessageSent")      → dispatch(appendMessage)  ← multi-tab echo
        ├── hub.on("MessageRead")      → dispatch(markRead)
        ├── hub.on("UserOnline")       → dispatch(setUserOnline)
        ├── hub.on("UserOffline")      → dispatch(setUserOffline)
        ├── hub.on("OnlineUsers")      → dispatch(setOnlineUsers)
        └── hub.on("UserTyping")       → local state + 3s timer

Logout
  └── stopHub() → connection.stop() → _connection = null
```

**Reconnection:** `withAutomaticReconnect` retries at 0s, 2s, 5s, 10s, 30s. `connectionStatus` in Redux reflects `Connecting | Connected | Reconnecting | Disconnected` — shown in the sidebar `ConnectionBadge`.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg0` | `#080810` | Page background |
| `--bg1` | `#0e0e1a` | Sidebar, panels |
| `--bg2` | `#14142a` | Input fields, cards |
| `--bg3` | `#1c1c38` | Hover states |
| `--accent` | `#7c3aed` | Primary brand purple |
| `--sent` | `#6d28d9` | Sent message bubble gradient |
| `--recv` | `#1e1e3a` | Received message bubble |
| `--online` | `#22c55e` | Online presence dot |
| `--t1` | `#f0f0fa` | Primary text |
| `--t2` | `#9898c0` | Secondary text |
| `--t3` | `#4a4a7a` | Muted / placeholder text |

**Fonts:** `Plus Jakarta Sans` (body) · `Bricolage Grotesque` (headings)

---

## 🐛 10 Bugs Fixed

| # | Bug | Fix |
|---|-----|-----|
| 1 | Hub created at module load before login | Created lazily in `startHub()` after token is saved |
| 2 | `ReceiveMessage` expected 2 args but backend sends 1 object | Updated handler signature to receive payload object |
| 3 | Wrong conversations endpoint (`/messages` not `/conversations`) | Updated to `GET /api/user/conversations` |
| 4 | `MessageSent` echo not handled → other tabs missed messages | Added listener in `useSignalRListeners` |
| 5 | JWT `sub` claim remapped by ASP.NET Core middleware | Added `JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear()` to backend |
| 6 | Google One Tap FedCM `navigator.credentials.get` conflict | Switched to `renderButton()` — no FedCM involved |
| 7 | StrictMode double-mount triggered two GSI prompt() calls | Module-level `initialized` flag + `renderButton` instead of `prompt` |
| 8 | JWT not passed to SignalR WebSocket connection | `accessTokenFactory: getToken` in `HubConnectionBuilder` |
| 9 | Read receipts not wired | `MarkMessageRead` hub invoke + `MessageRead` listener dispatching `markRead` |
| 10 | Typing indicator not implemented | `Typing` hub invoke (throttled 2s) + `UserTyping` listener with 3s auto-clear |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | UI framework |
| `react-dom` | 18.3.1 | DOM rendering |
| `react-router-dom` | 6.28.0 | Client-side routing |
| `@reduxjs/toolkit` | 2.3.0 | State management |
| `react-redux` | 9.1.2 | React-Redux bindings |
| `@microsoft/signalr` | 8.0.7 | WebSocket client |
| `jwt-decode` | 4.0.0 | Decode JWT claims without verify |
| `js-cookie` | 3.0.5 | Cookie storage for JWT |
| `typescript` | 4.9.5 | Type safety |

---

## 📄 License

MIT © [Chethan Kumblekar](https://github.com/chethankumblekar)
