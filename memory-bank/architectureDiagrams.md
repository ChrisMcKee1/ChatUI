# Architecture Diagrams: ChatUI

This file contains Mermaid diagrams that visualize the architecture of the Chat UI application. These diagrams are intended to help various technical stakeholders understand the system structure and flow.

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
    end
    
    subgraph Atoms
        A1[Button]
        A2[Typography]
        A3[TextField]
        A4[Box]
        A5[Avatar]
        A6[Fade]
        A7[Lucide Icons]
    end
    
    TPL --> O1
    TPL --> O2
    TPL --> O3
    TPL --> O4
    
    O1 --> M3
    O1 --> M4
    O2 --> M1
    O3 --> M2
    O4 --> M1
    
    M1 --> A2
    M1 --> A4
    M1 --> A5
    M1 --> A7
    
    M2 --> A1
    M2 --> A3
    M2 --> A7
    
    M3 --> A1
    M3 --> A7
    
    M4 --> A1
    M4 --> A7
    
    style Atoms fill:#0277bd,stroke:#01579b,color:#ffffff
    style Molecules fill:#388e3c,stroke:#1b5e20,color:#ffffff
    style Organisms fill:#e65100,stroke:#bf360c,color:#ffffff
    style Templates fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 2. Service Architecture

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph UI_Layer["UI Layer"]
        ChatContext[ChatContext]
        ChatUI[Chat UI Components]
    end
    
    subgraph Service_Layer["Service Layer"]
        SF[ServiceFactory]
        SP[ServiceProvider]
        
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
    
    subgraph External_Systems["External Systems"]
        StandardAPI[Standard Chat API]
        MultiAgentAPI[Multi-Agent Chat API]
        HistoryAPI[History API]
        LocalStorage[Browser LocalStorage]
    end
    
    ChatUI <--> ChatContext
    ChatContext <--> SP
    
    SP --> SF
    SF --> ICS
    SF --> IHS
    
    ICS --> MCS
    ICS --> ACS
    
    IHS --> LHS
    IHS --> AHS
    IHS --> MHS
    
    ACS --> StandardAPI
    ACS --> MultiAgentAPI
    AHS --> HistoryAPI
    LHS --> LocalStorage
    
    style UI_Layer fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Service_Layer fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style External_Systems fill:#d84315,stroke:#bf360c,color:#ffffff
    style Chat_Services fill:#558b2f,stroke:#33691e,color:#ffffff
    style History_Services fill:#f57f17,stroke:#e65100,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 3. Data Flow Diagram

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Client["Client (Browser)"]
        User[User]
        UI[UI Components]
        Context[Context Providers]
        LocalStore[Browser LocalStorage]
    end
    
    subgraph External["External Services"]
        Standard[Standard Chat API]
        MultiAgent[Multi-Agent Chat API]
        History[History API]
    end
    
    User -->|Types message| UI
    UI -->|Updates| Context
    
    Context -->|Standard Mode Request| Standard
    Context -->|Multi-Agent Mode Request| MultiAgent
    Context -->|Store Chat History| LocalStore
    Context -->|Store/Retrieve Remote History| History
    
    Standard -->|Response| Context
    MultiAgent -->|Streaming/Batch Response| Context
    History -->|Retrieved Histories| Context
    LocalStore -->|Retrieved Histories| Context
    
    Context -->|Updates| UI
    UI -->|Renders| User
    
    style Client fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style External fill:#c2185b,stroke:#880e4f,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## 4. Theming System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Theme_Files["Theme Files"]
        LT[LightTheme.json]
        DT[DarkTheme.json]
    end
    
    subgraph Theme_Provider["Theme Provider"]
        TP[ThemeProvider]
        TC[ThemeContext]
        MTH[MUI Theme Handler]
    end
    
    subgraph Components["Components"]
        AC[Atoms]
        MC[Molecules]
        OC[Organisms]
        TMP[Templates]
    end
    
    LT -->|Light Theme Config| TP
    DT -->|Dark Theme Config| TP
    
    TP -->|Sets Theme| TC
    TC -->|CSS Variables| Components
    TP -->|Configures| MTH
    MTH -->|MUI Theme| Components
    
    style Theme_Files fill:#8e24aa,stroke:#6a1b9a,color:#ffffff
    style Theme_Provider fill:#5e35b1,stroke:#4527a0,color:#ffffff
    style Components fill:#3949ab,stroke:#283593,color:#ffffff
    
    linkStyle default stroke:#d1c4e9,stroke-width:2px
```

## 5. Environment Configuration

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph ENV["Environment Variables"]
        SC_URL[STANDARD_CHAT_API_URL]
        SC_MODE[STANDARD_CHAT_API_MODE]
        MA_URL[MULTI_AGENT_CHAT_API_URL]
        MA_MODE[MULTI_AGENT_CHAT_API_MODE]
        CH_URL[CHAT_HISTORY_API_URL]
        CH_MODE[CHAT_HISTORY_MODE]
    end
    
    subgraph Factory["ServiceFactory"]
        CreateStandard[CreateStandardChatService]
        CreateMultiAgent[CreateMultiAgentChatService]
        CreateHistory[CreateHistoryService]
    end
    
    subgraph Services["Service Implementations"]
        MockChat[MockChatService]
        ApiChat[ApiChatService]
        MockHistory[MockHistoryService]
        ApiHistory[ApiHistoryService]
        LocalHistory[LocalHistoryService]
    end
    
    SC_MODE -->|"mode=mock"| CreateStandard
    SC_MODE -->|"mode=api"| CreateStandard
    SC_URL -->|apiUrl| CreateStandard
    
    MA_MODE -->|"mode=mock"| CreateMultiAgent
    MA_MODE -->|"mode=api"| CreateMultiAgent
    MA_URL -->|apiUrl| CreateMultiAgent
    
    CH_MODE -->|"mode=local"| CreateHistory
    CH_MODE -->|"mode=api"| CreateHistory
    CH_URL -->|apiUrl| CreateHistory
    
    CreateStandard -->|mode=mock| MockChat
    CreateStandard -->|mode=api| ApiChat
    
    CreateMultiAgent -->|mode=mock| MockChat
    CreateMultiAgent -->|mode=api| ApiChat
    
    CreateHistory -->|mode=local| LocalHistory
    CreateHistory -->|mode=api| ApiHistory
    CreateHistory -->|mode=mock| MockHistory
    
    style ENV fill:#ff8f00,stroke:#ef6c00,color:#ffffff
    style Factory fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style Services fill:#1565c0,stroke:#0d47a1,color:#ffffff
    
    linkStyle default stroke:#ffe0b2,stroke-width:2px
```

## 6. Response Processing Flow

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    User[User] -->|Sends message| Input[Chat Input]
    Input -->|Processes request| CM[Chat Mode]
    
    CM -->|Standard mode| SC[Standard Chat Service]
    CM -->|Multi-agent mode| MAC[Multi-Agent Chat Service]
    
    SC -->|API request| SCR[Standard Chat Response]
    MAC -->|API request| MACR[Multi-Agent Chat Response]
    
    SCR -->|Single response| MP[Message Processor]
    MACR -->|Multiple agents| MP
    
    MP -->|Creates Message objects| DS[Display System]
    DS -->|Renders messages| UI[User Interface]
    UI -->|Views| User
    
    subgraph Response_Types[Response Types]
        direction TB
        STD[Standard: Single message]
        BATCH[Multi-Agent Batch: Array of messages]
        STREAM[Multi-Agent Stream: SSE events]
    end
    
    SCR --- STD
    MACR --- BATCH
    MACR --- STREAM
    
    style Response_Types fill:#ad1457,stroke:#880e4f,color:#ffffff
    
    linkStyle default stroke:#f8bbd0,stroke-width:2px
```

## 7. Responsive Design System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    BP[Breakpoint System] -->|Screen size detection| RS[Responsive Strategy]
    
    RS -->|xs < 600px| XS[Mobile Strategy]
    RS -->|sm 600-900px| SM[Small Tablet Strategy]
    RS -->|md 900-1200px| MD[Large Tablet Strategy]
    RS -->|lg 1200-1536px| LG[Desktop Strategy]
    RS -->|xl > 1536px| XL[Large Desktop Strategy]
    RS -->|custom < 360px| XXS[Very Small Screen Strategy]
    
    XS --> Mobile[Mobile Optimizations]
    XXS --> VerySmall[Very Small Screen Optimizations]
    SM --> Tablet[Tablet Optimizations]
    MD --> Tablet
    LG --> Desktop[Desktop Optimizations]
    XL --> Desktop
    
    subgraph Components[Component Adaptations]
        CT[Compact Toggle Components]
        RP[Responsive Padding]
        RFS[Responsive Font Sizes]
        RDW[Responsive Drawer Width]
        RW[Responsive Widths]
    end
    
    Mobile --> CT
    Mobile --> RP
    Mobile --> RFS
    Mobile --> RDW
    Mobile --> RW
    
    VerySmall --> CT
    VerySmall --> RP
    VerySmall --> RFS
    VerySmall --> RDW
    VerySmall --> RW
    
    style Components fill:#5e35b1,stroke:#4527a0,color:#ffffff
    
    linkStyle default stroke:#d1c4e9,stroke-width:2px
```

## 8. Loading State System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    LT[Loading Trigger] -->|Initiates loading| LS[Loading State]
    
    LS -->|Standard mode| SLS[Standard Loading State]
    LS -->|Multi-agent mode| MLS[Multi-agent Loading State]
    
    SLS -->|Primary indicator| SPI[Standard Primary Indicator]
    SLS -->|Secondary indicator| SSI[Standard Secondary Indicator]
    
    MLS -->|Primary indicator| MPI[Multi-agent Primary Indicator]
    MLS -->|Secondary indicator| MSI[Multi-agent Secondary Indicator]
    
    subgraph Visual_Components[Visual Components]
        direction TB
        Fade[Fade Transitions]
        Spinner[Spinner Animation]
        ContextMsg[Contextual Messages]
        DisabledInput[Disabled Input State]
    end
    
    SPI --> Visual_Components
    SSI --> Visual_Components
    MPI --> Visual_Components
    MSI --> Visual_Components
    
    style Visual_Components fill:#e64a19,stroke:#bf360c,color:#ffffff
    
    linkStyle default stroke:#ffccbc,stroke-width:2px
```

## 9. Auto-Scrolling System

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    NT[New Message] -->|Triggers| AS[Auto-Scrolling System]
    CS[Content Streaming] -->|Triggers| AS
    
    subgraph Auto_Scroll_System[Auto-Scroll System]
        SC[Scroll Controller]
        SB[Scroll Behavior]
        MO[Mutation Observer]
    end
    
    AS --> Auto_Scroll_System
    
    SC -->|Regular update| SM[Smooth Scrolling]
    SC -->|Streaming update| IM[Immediate Scrolling]
    
    MO -->|Detects DOM changes| IM
    
    style Auto_Scroll_System fill:#00796b,stroke:#004d40,color:#ffffff
    
    linkStyle default stroke:#80cbc4,stroke-width:2px
```

## 10. OpenTelemetry Implementation

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph App["Next.js Application"]
        NC[Next.js Config]
        IH[Instrumentation Hook]
        OC[OpenTelemetry Config]
        
        subgraph Instrumentation["Custom Instrumentation"]
            TU[Telemetry Utils]
            UA[User Action Tracking]
            RP[Response Processing]
            PR[Performance Recording]
        end
        
        subgraph Components["Application Components"]
            CPL[ChatPageLayout]
            CU["ChatUtils/Context"]
            API[API Services]
        end
    end
    
    subgraph Export["Telemetry Export"]
        TE[Trace Exporter]
        ME[Metric Exporter]
        CollectorAPI[OpenTelemetry Collector API]
    end
    
    subgraph Backend["Observability Backend"]
        Jaeger[Jaeger UI]
        Zipkin[Zipkin]
        Prometheus[Prometheus]
        Grafana[Grafana]
    end
    
    NC -->|enables| IH
    IH -->|loads| OC
    OC -->|configures| TE
    OC -->|configures| ME
    
    TE --> CollectorAPI
    ME --> CollectorAPI
    
    TU -->|provides| UA
    TU -->|provides| RP
    TU -->|provides| PR
    
    CPL -->|uses| TU
    CU -->|uses| TU
    API -->|uses| TU
    
    CollectorAPI --> Jaeger
    CollectorAPI --> Zipkin
    CollectorAPI --> Prometheus
    Prometheus --> Grafana
    
    style App fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Export fill:#e65100,stroke:#bf360c,color:#ffffff
    style Backend fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style Instrumentation fill:#5e35b1,stroke:#4527a0,color:#ffffff
    style Components fill:#00838f,stroke:#006064,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
``` 