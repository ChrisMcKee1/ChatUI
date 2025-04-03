# Architecture Diagrams: ChatUI

This file contains Mermaid diagrams that visualize the architecture of the Chat UI application. These diagrams provide technical stakeholders with a clear understanding of system structure and flow.

## 1. Component Architecture (Atomic Design)

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Templates
        TPL[ChatPageLayout]
    end
    
    subgraph Organisms
        O1[ChatHeader]
        O2[ChatHistoryPanel]
        O3[ChatInputArea]
        O4[ChatMessagePanel]
    end
    
    subgraph Molecules
        M1[MessageBubble]
        M2[ChatInput]
        M3[AgentToggle]
        M4[ThemeToggle]
        M5[ChatHistoryItem]
        M6[NewChatButton]
    end
    
    subgraph Atoms
        A1[Button]
        A2[Typography]
        A3[TextField]
        A4[Box]
        A5[Avatar]
        A6[Fade]
        A7[Lucide Icons]
        A8[Spinner]
    end
    
    TPL --> O1
    TPL --> O2
    TPL --> O3
    TPL --> O4
    
    O1 --> M3
    O1 --> M4
    O2 --> M5
    O2 --> M6
    O3 --> M2
    O4 --> M1
    
    M1 --> A2
    M1 --> A4
    M1 --> A5
    M1 --> A7
    
    M2 --> A1
    M2 --> A3
    M2 --> A7
    M2 --> A8
    
    M3 --> A1
    M3 --> A7
    
    M4 --> A1
    M4 --> A7
    
    M5 --> A2
    M5 --> A4
    M5 --> A7
    
    M6 --> A1
    M6 --> A7
    
    style Atoms fill:#0277bd,stroke:#01579b,color:#ffffff
    style Molecules fill:#388e3c,stroke:#1b5e20,color:#ffffff
    style Organisms fill:#e65100,stroke:#bf360c,color:#ffffff
    style Templates fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 2. Application Architecture

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Next_Framework["Next.js Framework"]
        App[App Router]
        Layout[Root Layout]
        Page[Page Component]
    end
    
    subgraph Context_Providers["Context Providers"]
        CP[ChatProvider]
        TP[ThemeProvider]
        SP[ServiceProvider]
    end
    
    subgraph UI_Layer["UI Layer"]
        TPL[ChatPageLayout Template]
        Components[UI Components]
    end
    
    subgraph Service_Layer["Service Layer"]
        SF[ServiceFactory]
        
        subgraph Chat_Services["Chat Services"]
            ICS[IChatService Interface]
            MCS[MockChatService]
            ACS[ApiChatService]
        end
        
        subgraph History_Services["History Services"]
            IHS[IHistoryService Interface]
            LHS[LocalHistoryService]
            AHS[ApiHistoryService]
            MHS[MockHistoryService]
        end
    end
    
    subgraph Telemetry["Telemetry"]
        OpenTel[OpenTelemetry]
        TelUtils[Telemetry Utils]
    end
    
    subgraph External_Systems["External Systems"]
        APIs[Chat & History APIs]
        LocalStorage[Browser LocalStorage]
        TelBackend[Telemetry Backend]
    end
    
    App --> Layout
    Layout --> Page
    Layout --> Context_Providers
    Page --> UI_Layer
    
    Context_Providers --> TPL
    
    CP --> Components
    TP --> Components
    SP --> SF
    
    SF --> ICS
    SF --> IHS
    
    ICS --> MCS
    ICS --> ACS
    
    IHS --> LHS
    IHS --> AHS
    IHS --> MHS
    
    ACS --> APIs
    AHS --> APIs
    LHS --> LocalStorage
    
    Components --> TelUtils
    TelUtils --> OpenTel
    OpenTel --> TelBackend
    
    style Next_Framework fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Context_Providers fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style UI_Layer fill:#e65100,stroke:#bf360c,color:#ffffff
    style Service_Layer fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style External_Systems fill:#d84315,stroke:#bf360c,color:#ffffff
    style Telemetry fill:#0097a7,stroke:#006064,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 3. State Management and Data Flow

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph User_Interactions["User Interactions"]
        SendMsg[Send Message]
        CreateChat[Create New Chat]
        SelectChat[Select Chat]
        DeleteChat[Delete Chat]
        ToggleAgent[Toggle Agent Mode]
        ToggleTheme[Toggle Theme]
    end
    
    subgraph Context["Context Providers"]
        ChatCtx[ChatContext]
        ThemeCtx[ThemeContext]
    end
    
    subgraph Services["Services"]
        ChatSvc[ChatService]
        HistorySvc[HistoryService]
    end
    
    subgraph State["Application State"]
        Messages[Messages]
        Histories[Chat Histories]
        ActiveChat[Active Chat]
        AgentMode[Agent Mode]
        Loading[Loading State]
        Theme[Theme State]
    end
    
    subgraph External["External Systems"]
        APIs[External APIs]
        Storage[Browser Storage]
    end
    
    SendMsg -->|Triggers| ChatCtx
    CreateChat -->|Triggers| ChatCtx
    SelectChat -->|Triggers| ChatCtx
    DeleteChat -->|Triggers| ChatCtx
    ToggleAgent -->|Triggers| ChatCtx
    ToggleTheme -->|Triggers| ThemeCtx
    
    ChatCtx -->|Uses| ChatSvc
    ChatCtx -->|Uses| HistorySvc
    
    ChatSvc -->|API Calls| APIs
    HistorySvc -->|API Calls| APIs
    HistorySvc -->|Local Storage| Storage
    
    ChatCtx -->|Updates| Messages
    ChatCtx -->|Updates| Histories
    ChatCtx -->|Updates| ActiveChat
    ChatCtx -->|Updates| AgentMode
    ChatCtx -->|Updates| Loading
    ThemeCtx -->|Updates| Theme
    
    style User_Interactions fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Context fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style Services fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style State fill:#e65100,stroke:#bf360c,color:#ffffff
    style External fill:#d84315,stroke:#bf360c,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 4. Message Processing Flow

```mermaid
%%{init: {'theme':'dark'}}%%
sequenceDiagram
    participant User
    participant UI as UI Components
    participant ChatCtx as ChatContext
    participant ChatSvc as ChatService
    participant HistorySvc as HistoryService
    participant API as External API
    participant Storage as Local Storage
    
    User->>UI: Submit message
    UI->>ChatCtx: sendMessage(content)
    
    ChatCtx->>ChatCtx: Add user message to state
    ChatCtx->>UI: Update with user message
    
    ChatCtx->>ChatCtx: Set loading state
    ChatCtx->>UI: Update loading indicators
    
    alt Standard Mode
        ChatCtx->>ChatSvc: sendMessage(userMessage)
        ChatSvc->>API: POST /chat with message
        API-->>ChatSvc: Response with assistant message
        ChatSvc-->>ChatCtx: Return assistant message
    else Multi-Agent Mode
        ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
        ChatSvc->>API: POST /multi-agent-chat with message
        API-->>ChatSvc: Response with agent messages
        ChatSvc-->>ChatCtx: Return agent messages
    end
    
    ChatCtx->>ChatCtx: Add response to messages state
    ChatCtx->>UI: Update with response
    
    ChatCtx->>HistorySvc: saveMessages(chatId, messages)
    
    alt Local History Mode
        HistorySvc->>Storage: Save to localStorage
    else API History Mode
        HistorySvc->>API: POST /history/save with messages
    end
    
    ChatCtx->>ChatCtx: Clear loading state
    ChatCtx->>UI: Update UI (hide loading indicators)
    
    UI->>User: Display complete conversation
```

## 5. Environment Configuration

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Runtime_Environments["Runtime Environments"]
        Dev[Development]
        Prod[Production]
        Test[Testing]
    end
    
    subgraph Configuration_Sources["Configuration Sources"]
        EnvLocal[.env.local]
        EnvDevelopment[.env.development]
        EnvProduction[.env.production]
        EnvTest[.env.test]
        GHSecrets[GitHub Secrets]
        AzureSettings[Azure App Settings]
    end
    
    subgraph Service_Factory["Service Factory"]
        CreateChat[createChatService]
        CreateMultiAgent[createMultiAgentChatService]
        CreateHistory[createHistoryService]
    end
    
    subgraph Environment_Variables["Key Environment Variables"]
        SC_URL[NEXT_PUBLIC_STANDARD_CHAT_API_URL]
        SC_MODE[NEXT_PUBLIC_STANDARD_CHAT_API_MODE]
        MA_URL[NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL]
        MA_MODE[NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE]
        CH_URL[NEXT_PUBLIC_CHAT_HISTORY_API_URL]
        CH_MODE[NEXT_PUBLIC_CHAT_HISTORY_MODE]
        OTEL[OTEL_EXPORTER_OTLP_ENDPOINT]
    end
    
    Dev -->|Uses| EnvLocal
    Dev -->|Uses| EnvDevelopment
    Test -->|Uses| EnvTest
    Prod -->|CI/CD| GHSecrets
    Prod -->|Runtime| AzureSettings
    
    EnvLocal -->|Configures| Environment_Variables
    EnvDevelopment -->|Configures| Environment_Variables
    EnvProduction -->|Configures| Environment_Variables
    EnvTest -->|Configures| Environment_Variables
    GHSecrets -->|Configures| Environment_Variables
    AzureSettings -->|Configures| Environment_Variables
    
    Environment_Variables -->|Used by| Service_Factory
    
    style Runtime_Environments fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Configuration_Sources fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style Service_Factory fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style Environment_Variables fill:#e65100,stroke:#bf360c,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 6. Theming System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Theme_Settings["Theme Settings"]
        LT[Light Theme]
        DT[Dark Theme]
    end
    
    subgraph Theme_Context["Theme Context"]
        TS[ThemeState]
        TF[ToggleTheme Function]
    end
    
    subgraph Style_Systems["Style Systems"]
        MUI[Material-UI Theme]
        TW[Tailwind CSS]
        CS[CSS Variables]
    end
    
    subgraph Components["Component Styling"]
        Atoms[Atomic Components]
        Molecules[Molecular Components]
        Organisms[Organism Components]
        Templates[Template Components]
    end
    
    subgraph Storage["Storage"]
        LS[localStorage]
    end
    
    TS -->|Current Theme| MUI
    TS -->|Current Theme| TW
    TS -->|Current Theme| CS
    TF -->|Toggles| TS
    
    TS -->|Persists| LS
    LS -->|Restores| TS
    
    LT -->|Configures| MUI
    DT -->|Configures| MUI
    
    MUI -->|Styles| Atoms
    MUI -->|Styles| Molecules
    TW -->|Styles| Atoms
    TW -->|Styles| Molecules
    TW -->|Styles| Organisms
    CS -->|Styles| Atoms
    CS -->|Styles| Molecules
    
    style Theme_Settings fill:#8e24aa,stroke:#6a1b9a,color:#ffffff
    style Theme_Context fill:#5e35b1,stroke:#4527a0,color:#ffffff
    style Style_Systems fill:#3949ab,stroke:#283593,color:#ffffff
    style Components fill:#0097a7,stroke:#006064,color:#ffffff
    style Storage fill:#d84315,stroke:#bf360c,color:#ffffff
    
    linkStyle default stroke:#d1c4e9,stroke-width:2px
```

## 7. Responsive Design System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Breakpoints["Breakpoint System"]
        XXS["xs < 360px (Very Small)"]
        XS["xs < 600px (Mobile)"]
        SM["sm 600-900px (Tablet)"]
        MD["md 900-1200px (Large Tablet)"]
        LG["lg 1200-1536px (Desktop)"]
        XL["xl > 1536px (Large Desktop)"]
    end
    
    subgraph Component_Adaptations["Component Adaptations"]
        Layout[Responsive Layout]
        Spacing[Responsive Spacing]
        Typography[Responsive Typography]
        UI_Elements[UI Element Sizing]
        Chat_Interface[Chat Interface]
    end
    
    subgraph Implementation["Implementation Technologies"]
        MUI_BP[MUI Breakpoints]
        Media_Queries[CSS Media Queries]
        TW_BP[Tailwind Breakpoints]
        React_Hooks[React Hooks]
    end
    
    Breakpoints -->|Define| Implementation
    Implementation -->|Applied to| Component_Adaptations
    
    XXS -->|Very compact UI| UI_Elements
    XXS -->|Minimal padding| Spacing
    XXS -->|Smaller fonts| Typography
    XXS -->|Collapsed header| Chat_Interface
    
    XS -->|Stack layout| Layout
    XS -->|Reduced padding| Spacing
    XS -->|Optimized fonts| Typography
    XS -->|Mobile optimized UI| UI_Elements
    
    SM -->|Adaptive layout| Layout
    SM -->|Balanced spacing| Spacing
    SM -->|Tablet-optimized UI| UI_Elements
    
    MD -->|Hybrid layout| Layout
    LG -->|Full layout| Layout
    XL -->|Enhanced layout| Layout
    
    style Breakpoints fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Component_Adaptations fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style Implementation fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 8. Loading and Error Handling System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Triggers["Loading Triggers"]
        SendMsg[Send Message]
        FetchHistory[Load Chat History]
        SwitchChat[Switch Chat]
        SwitchMode[Switch Agent Mode]
    end
    
    subgraph States["Loading & Error States"]
        Loading[Loading State]
        Error[Error State]
    end
    
    subgraph UI_Indicators["UI Indicators"]
        Spinners[Loading Spinners]
        Disabled[Disabled Inputs]
        Messages[Status Messages]
        Animations[Loading Animations]
        ErrorDisplay[Error Messages]
        RetryOptions[Retry Options]
    end
    
    subgraph Handling["Error Handling"]
        Catch[Try/Catch Blocks]
        Log[Error Logging]
        Fallback[Fallback Content]
        Recovery[Recovery Actions]
    end
    
    Triggers -->|Activates| States
    States -->|Controls| UI_Indicators
    Error -->|Triggers| Handling
    
    SendMsg -->|Sets| Loading
    FetchHistory -->|Sets| Loading
    SwitchChat -->|Sets| Loading
    SwitchMode -->|Sets| Loading
    
    Loading -->|Shows| Spinners
    Loading -->|Enables| Disabled
    Loading -->|Displays| Messages
    Loading -->|Triggers| Animations
    
    Error -->|Shows| ErrorDisplay
    Error -->|Offers| RetryOptions
    
    Catch -->|Captures| Error
    Log -->|Records| Error
    Fallback -->|Displays when| Error
    Recovery -->|Attempts after| Error
    
    style Triggers fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style States fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style UI_Indicators fill:#e65100,stroke:#bf360c,color:#ffffff
    style Handling fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 9. Testing Architecture

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Testing_Types["Testing Types"]
        Unit[Unit Tests]
        Integration[Integration Tests]
        Component[Component Tests]
        E2E[End-to-End Tests]
        Storybook[Storybook Stories]
    end
    
    subgraph Testing_Technologies["Testing Technologies"]
        Vitest[Vitest]
        RTL[React Testing Library]
        MSW[Mock Service Worker]
        Cypress[Cypress]
        SB[Storybook]
    end
    
    subgraph Test_Targets["Test Targets"]
        Components[UI Components]
        Hooks[Custom Hooks]
        Context[Context Providers]
        Services[Service Layer]
        Utils[Utility Functions]
    end
    
    subgraph CI_Integration["CI Integration"]
        GHA[GitHub Actions]
        PR_Checks[PR Checks]
        Coverage[Code Coverage]
    end
    
    Unit -->|Uses| Vitest
    Unit -->|Uses| RTL
    Unit -->|Tests| Hooks
    Unit -->|Tests| Utils
    Unit -->|Tests| Services
    
    Integration -->|Uses| Vitest
    Integration -->|Uses| RTL
    Integration -->|Uses| MSW
    Integration -->|Tests| Context
    Integration -->|Tests| Services
    
    Component -->|Uses| RTL
    Component -->|Uses| Vitest
    Component -->|Tests| Components
    
    E2E -->|Uses| Cypress
    E2E -->|Tests| Components
    E2E -->|Tests| Services
    
    Storybook -->|Uses| SB
    Storybook -->|Tests| Components
    
    Testing_Types -->|Runs on| GHA
    GHA -->|Enforces| PR_Checks
    GHA -->|Reports| Coverage
    
    style Testing_Types fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Testing_Technologies fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style Test_Targets fill:#e65100,stroke:#bf360c,color:#ffffff
    style CI_Integration fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 10. Deployment Architecture

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Development["Development Environment"]
        Local[Local Development]
        PR[Pull Request Previews]
    end
    
    subgraph CI_CD["CI/CD Pipeline"]
        GHA[GitHub Actions]
        BuildTest[Build & Test]
        Deploy[Deploy]
        ManualTrigger[Manual Workflow Trigger]
    end
    
    subgraph Infrastructure["Cloud Infrastructure"]
        subgraph FrontendInfra["Frontend Infrastructure"]
            AzureStaticWebApps[Azure Static Web Apps]
            CDN[Azure CDN]
            Monitoring[Application Insights]
        end
        
        subgraph BackendInfra["Backend Infrastructure (Separate)"]
            API_Backend[API Backend Services]
            AppService[Azure App Service]
        end
    end
    
    subgraph Configuration["Environment Configuration"]
        subgraph FrontendConfig["Frontend Configuration"]
            EnvLocal[.env.local]
            GitHubSecrets[GitHub Secrets]
            BuildEnv[Build-time Variables]
            NextConfig[Next.js Config]
        end
        
        subgraph BackendConfig["Backend Configuration"]
            AppSettings[Azure App Settings]
            KeyVault[Azure Key Vault]
        end
    end
    
    Local -->|Changes| PR
    PR -->|Triggers| GHA
    ManualTrigger -->|Triggers| GHA
    
    GHA -->|Executes| BuildTest
    BuildTest -->|If successful| Deploy
    
    BuildTest -->|Uses| NextConfig
    NextConfig -->|Ignores Linting/TypeScript Errors| BuildTest
    
    Deploy -->|Deploys to| AzureStaticWebApps
    AzureStaticWebApps -->|Fronted by| CDN
    AzureStaticWebApps -->|Monitored by| Monitoring
    
    EnvLocal -->|Used in| Local
    GitHubSecrets -->|Generates| BuildEnv
    BuildEnv -->|Used in| BuildTest
    GitHubSecrets -->|Used in| Deploy
    
    style Development fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style CI_CD fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style FrontendInfra fill:#e65100,stroke:#bf360c,color:#ffffff
    style BackendInfra fill:#d84315,stroke:#bf360c,color:#ffffff
    style FrontendConfig fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style BackendConfig fill:#558b2f,stroke:#33691e,color:#ffffff
    style ManualTrigger fill:#5e35b1,stroke:#4527a0,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
``` 