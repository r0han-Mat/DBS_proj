# Technical Architecture Guide: Ecom-UI

This document explains the internal mechanics of the Ecom-UI platform, from the Java backend to the containerized database infrastructure.

---

## 1. Backend Architecture (Spring Boot)
The backend follows a standard **Layered Architecture** to separate concerns:

1.  **Controller Layer**: Handles incoming HTTP requests (REST API).
    *   Example: `ProductController` receives a `GET /api/products` request.
2.  **Service Layer**: Contains business logic (e.g., validation, calculations).
3.  **Repository Layer**: Interacts with the data source using **Spring Data JPA**.
4.  **Model Layer**: Represents Database Tables as Java Objects (**@Entity**).

---

## 2. ORM: JPA and Hibernate
**Object-Relational Mapping (ORM)** is the bridge between Java and PostgreSQL.

### 2.1 How Queries are Generated
We don't write raw SQL for every task. Instead, **Hibernate** (the implementation of JPA) generates it automatically:

-   **Derived Queries**: If we define a method `findByCategory(String category)` in the repository, Hibernate parses the method name and generates:
    ```sql
    SELECT * FROM products WHERE category = ?;
    ```
-   **Dirty Checking**: When you change a Java object's value (e.g., `product.setPrice(100)`), Hibernate tracks this "dirty" state and automatically issues an `UPDATE` SQL statement when the transaction completes.
-   **JPQL**: For complex tasks (like search), we use Java Persistence Query Language which looks like SQL but operates on Java Objects.

---

## 3. API Connection (Frontend to Backend)
The communication happens over **JSON** via HTTP:

1.  **Frontend**: React uses **Axios** to send an asynchronous request to `http://localhost:8080/api/...`.
2.  **CORS**: The backend is configured to allow requests specifically from the frontend's origin (`http://localhost:5173`).
3.  **X-User-ID**: A custom header is used to identify the current user, simulating an authentication token for the shopping cart.

---

## 4. Docker Infrastructure & Networking
The database environment is fully containerized using **Docker Compose**.

### 4.1 The "Postgres" Bridge Network
When you run `docker-compose up`, Docker creates a virtual network.
-   **Postgres Container**: Named `postgres_container`. It listens on internal port `5432`.
-   **pgAdmin Container**: Named `pgadmin_container`. It also joins this network.

### 4.2 DNS and Service Names
Inside the Docker network, containers don't need IP addresses. They use **Service Names** as hostnames:
-   In pgAdmin, we connect to the database using the hostname `postgres` (the name defined in `docker-compose.yml`).
-   Docker's internal DNS server resolves `postgres` to the private IP of the database container.

### 4.3 Port Mapping (The Bridge)
To allow the **Java App (running on your host)** to talk to the **Postgres Container**:
-   We map `5433:5432`.
-   This means traffic to `localhost:5433` on your Windows computer is "bridged" into the container's port `5432`.

---

## 5. Summary of Data Flow
1.  **User** clicks "Add to Cart" → **React** sends JSON to **Spring Boot**.
2.  **Spring Boot** uses **JPA/Hibernate** to generate SQL.
3.  **SQL** travels through **Port 5433** into the **Docker Network**.
4.  **PostgreSQL** executes the SQL and updates the **Persistent Volume**.
5.  **Triggers** (PL/pgSQL) automatically update stock and logs.
