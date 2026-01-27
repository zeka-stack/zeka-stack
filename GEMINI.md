# Zeka Stack Context

**每次回答前后回答结束后都需要叫我:【dong4j】**

## Project Overview
Zeka Stack is a comprehensive, enterprise-grade Java microservice ecosystem. It provides a full-stack solution ranging from foundational build infrastructure to business-level applications. The name "Zeka" implies "Intelligence Core".

**Key Characteristics:**
- **Monorepo Structure:** Managed as a single multi-module Maven project.
- **Layered Architecture:** Strict dependency flow from infrastructure to business logic.
- **Unified Standards:** Consistent coding styles, dependencies, and tooling.

## Architecture & Modules

The stack is organized into 6 logical layers (L0-L5) and supporting tools:

### Layer 0: Arco (Build Infrastructure)
*   **Path:** `arco-meta/`
*   **Role:** The absolute foundation. Manages build configurations, dependencies, and Maven plugins.
*   **Components:** `arco-supreme` (Root Parent), `arco-builder` (Builder Parent), `arco-maven-plugin` (Automation), `arco-processor` (Annotation processing).

### Layer 1: Blen (Kernel)
*   **Path:** `blen-kernel/`
*   **Role:** Common libraries and core utilities used across the entire stack.
*   **Components:** Common utils, Auth, Web encapsulation, Validation, Tracing.

### Layer 2: Cubo (Spring Boot Starters)
*   **Path:** `cubo-starter/`
*   **Role:** A collection of standardized Spring Boot Starters and scaffolding.
*   **Components:** MyBatis, LogSystem, OpenAPI, Messaging, REST.
*   **Examples:** `cubo-starter-examples/` contains usage examples.

### Layer 3: Domi (Microservice Suites)
*   **Path:** `domi-suite/`
*   **Role:** Reusable microservice components (The "Middle Platform").
*   **Components:** Auth Service, Gateway, Log Center, UID Generator.

### Layer 4: Eiko (Middleware Orchestration)
*   **Path:** `eiko-orch/`
*   **Role:** Unified encapsulation and orchestration of middleware.
*   **Components:** APM, JetCache, Nacos, Sentinel, Scheduler.

### Layer 5: Felo (Business Applications)
*   **Path:** `felo-space/`
*   **Role:** Actual business applications demonstrating the stack.
*   **Components:** `felo-mall` (E-commerce), `felo-pay` (Payment).

### Supporting Tools
*   **Zeka IDEA Plugin:** (`zeka-idea-plugin/`) A suite of IntelliJ plugins (AI-driven & tools) to assist development. **Note:** Built with Gradle.
*   **Web UI:** (`supports/zeka-stack-webui/`) React-based dashboard for the stack.
*   **Supports:** (`supports/`) Scripts, icons, and configuration files.

## Build & Development

### Core Stack (Maven)
The main stack uses Maven. The project includes a Maven Wrapper (`mvnw`).

*   **Build Whole Project:**
    ```bash
    ./mvnw clean install -DskipTests
    ```
*   **Build Specific Module:**
    ```bash
    ./mvnw clean install -pl blen-kernel -am
    ```

### Running Applications
*   **Run a Cubo Example:**
    ```bash
    cd cubo-starter-examples/cubo-rest-spring-boot-sample
    ../../mvnw spring-boot:run
    ```
*   **Run a Felo Business App:**
    ```bash
    cd felo-space/felo-mall
    ../../mvnw spring-boot:run
    ```

### IDEA Plugin (Gradle)
The `zeka-idea-plugin` directory is a separate Gradle build.
*   **Build Plugin:** `./gradlew buildPlugin` (inside `zeka-idea-plugin/`)
*   **Run Sandbox IDE:** `./gradlew runIde`

## Conventions

*   **Version Control:** Git with Submodules.
*   **Commit Messages:** Conventional Commits (feat, fix, docs, style, refactor, test, chore).
*   **Code Style:** Unified style defined in `supports/`.
*   **Branching:** `main` (Stable), `develop` (Dev), `feature/*`, `hotfix/*`.

## Key Files
*   `pom.xml`: Root Maven reactor file.
*   `makefile`: Contains specific dev task commands (e.g., `vibe-kanban`).
*   `supports/scripts/init-stack.sh`: Script to initialize the stack environment.
