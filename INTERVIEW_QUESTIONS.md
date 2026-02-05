# 🎓 Full Stack Interview Question Bank (Freelancer App)

This document contains interview questions ranging from **Beginner** to **Pro** level.
It is divided into **General Concepts** (Standard Interview Questions) and **Project Deep Dive** (Specific to your code).

---

# � Part 1: General Concepts (Beginner to Pro)

## 🟢 Level 1: Beginner (Basics)
1.  **Q:** What is full-stack development?
    **A:** Developing both the client-side (frontend) and server-side (backend) of an application.
2.  **Q:** What is the difference between HTTP and HTTPS?
    **A:** HTTPS is the secure version of HTTP and uses encryption (SSL/TLS) to protect data.
3.  **Q:** What is JSON?
    **A:** JavaScript Object Notation (JSON) is a lightweight format for storing and transporting data.
4.  **Q:** What is React.js?
    **A:** A JavaScript library for building user interfaces using reusable components.
5.  **Q:** What is the DOM?
    **A:** The Document Object Model (DOM) is a tree structure representing the HTML elements of a webpage.
6.  **Q:** What is Java?
    **A:** A high-level, object-oriented programming language that runs on the Java Virtual Machine (JVM).
7.  **Q:** What is the main method in Java?
    **A:** `public static void main(String[] args)` is the entry point where the program starts execution.

## 🟡 Level 2: Intermediate (Implementation)
8.  **Q:** What are React Hooks (e.g., `useState`)?
    **A:** Functions that let you "hook into" React state and lifecycle features from functional components.
9.  **Q:** What is `useEffect` used for?
    **A:** Handling side effects like data fetching, DOM updates, or timers after a component renders.
10. **Q:** What is Spring Boot?
    **A:** A framework that simplifies building production-ready Spring applications with minimal configuration.
11. **Q:** What is Dependency Injection (DI)?
    **A:** A pattern where the framework gives an object the dependencies it needs, rather than the object creating them itself.
12. **Q:** What is the `@RestController` annotation?
    **A:** It marks a class as a web controller where every method returns a domain object (usually JSON) instead of a view.
13. **Q:** What is JWT?
    **A:** JSON Web Token is a secure way to transmit information between parties, commonly used for stateless authentication.

## 🔴 Level 3: Pro (Architecture)
14. **Q:** What is the Virtual DOM?
    **A:** A lightweight copy of the DOM that React uses to optimize updates by only changing what's necessary (diffing).
15. **Q:** What is CORS and why do we need it?
    **A:** Cross-Origin Resource Sharing is a security feature restricting browser requests to a different domain (e.g., React on port 5173 -> Boot on 8080).
16. **Q:** How do Microservices differ from Monoliths?
    **A:** Microservices break the app into small, independent services communicating via APIs, while a Monolith is a single unified codebase.

---

# 🚀 Part 2: Project Specific Deep Dive (Your Codebase)

These questions relate directly to **how `FreelancerApp Final` is built**.

## 🎨 Frontend Architecture (React + Vite + Tailwind)

### Routing (React Router v6)
17. **Q:** What library are you using for routing and which version?
    **A:** We are using `react-router-dom` Version 6.
18. **Q:** How do you define routes in your request?
    **A:** We use the `<Routes>` component wrapping multiple `<Route>` elements, accessible via `App.jsx`.
19. **Q:** **(Crucial)** What is the purpose of the `<Outlet />` component used in `MainLayout`?
    **A:** `<Outlet />` acts as a placeholder where child routes (like Home, Login) render when their parent route (`MainLayout`) is active.
20. **Q:** Why do you use "Nested Routes" (e.g., wrapping paths inside `MainLayout`)?
    **A:** To keep the Navigation Bar and Footer visible on all pages without repeating the code in every single page component.
21. **Q:** How does the `Dashboard` routing differ from the public routing?
    **A:** It uses a separate `DashboardLayout` (likely with a Sidebar) and wraps routes in a `DashboardProvider` to share state.

### State & Logic
22. **Q:** What is the purpose of `DashboardProvider` in `App.jsx`?
    **A:** It uses the React Context API to provide global state (like user details or sidebar toggle) to all dashboard components without prop drilling.
23. **Q:** You used `vite` instead of `create-react-app`. Why?
    **A:** Vite is significantly faster in development mode (hot reload) and build time compared to Webpack-based tools like CRA.
24. **Q:** How is styling handled in your project?
    **A:** We use **Tailwind CSS**, a utility-first framework (`className="flex flex-col..."`), which allows for faster styling directly in the markup.

## 🛠 Backend Architecture (Spring Boot)

### Authentication Flow (AuthController)
25. **Q:** How does your Signup process work?
    **A:** It's a two-step process: User submits details -> Backend likely sends an OTP -> User verifies OTP via `/verify-otp` -> Account is activated.
26. **Q:** What annotation did you use to allow your React app to talk to Spring Boot?
    **A:** `@CrossOrigin(origins = "http://localhost:5173")` on the Controller, which fixes CORS errors.
27. **Q:** What does the `login` endpoint return?
    **A:** It returns a `LoginResponse` DTO, which typically contains a **JWT Token** and user details (Role, Name) for the frontend to store.
28. **Q:** Why do you use DTOs (Data Transfer Objects) like `SignupRequest` instead of Entities?
    **A:** To decouple the internal database structure (Entity) from the data exposed to/received from the API, improving security and flexibility.

### Structure & Features
29. **Q:** How do you distinguish between a Client and a Freelancer?
    **A:** We use a `Role` enum (passed in `SignupRequest`), and different Dashboard Routes (`/client-dashboard` vs `/freelancer-dashboard`) are rendered based on this role.
30. **Q:** How are you handling Images/Files (e.g., for Job Posts)?
    **A:** We have an `UploadController` that likely accepts `MultipartFile` inputs and saves them to a local directory or cloud storage.
31. **Q:** What database interaction method are you using?
    **A:** We use **Spring Data JPA** (Hibernate), allowing us to interact with the database using Java Interfaces (`Repository`) instead of writing raw SQL.

## 🔗 Full Stack Integration
32. **Q:** How does the frontend communicate with the backend?
    **A:** Using **Axios** or the `fetch` API to make HTTP requests (GET, POST) to the endpoints defined in the Spring Controllers.
33. **Q:** How exactly do you protect the Dashboard from non-logged-in users?
    **A:** The frontend checks for a stored Token (in LocalStorage). If missing, `useEffect` or a Protected Route component redirects them to `/login`.
34. **Q:** If you refresh the page, how does the app know you are still logged in?
    **A:** The Token stored in `localStorage` is read on initialization; if valid, the user state is restored; otherwise, they are logged out.

