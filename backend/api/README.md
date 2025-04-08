# Let's Enroll - API module

Module for the frontend API.

## Notable libraries

- [Spring Boot](https://docs.spring.io/spring-boot/index.html) - Opinionated configuration of Spring Framework
- [Spring OAuth2 Client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html) - Provides authentication using Discord as an identity provider
- [Spring OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html) - JWT-secured communication between API and Bot
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html) - Provides authentication and authorization using the OAuth2 credentials, HTTP sessions and persistence
- [Spring MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html) - Only used to create REST APIs
- [MapStruct](https://mapstruct.org/) - Mapping between JPA entities and data transfer objects
- [Flyway](https://github.com/flyway/flyway) - Database migration
- [spring-mockk](https://github.com/Ninja-Squad/springmockk) - Spring integration for [Mockk](https://mockk.io/) (Kotlin mocks)

## Running the dev API
1. Start from the root directory (where `config-template` is)
2. Copy `config-template` as `config`
3. Fill the values in `config/.env`
4. Fill the values in `config/application.yaml`, values are required unless commented
5. Generate the secret key for API-Bot communication:
   1. Open a terminal in the `config` directory, with `openssl` available
      - On Windows: use Git Bash
      - On Linux: Open your usual terminal
   2. Run `openssl rand -out private.key -base64 64`
6. (Optional) Delete `logback.xml`
7. (Optional) Create a run configuration, with the `dev` profile enabled.
   - On IntelliJ IDEA Ultimate, prefer making a `Spring Boot` run configuration and add `dev` to the active profiles
   - On other editors, you can add the following argument: `-Dspring.profiles.active=dev`
8. Run the `ApplicationMain` class in your editor