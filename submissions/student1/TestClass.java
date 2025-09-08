package com.example;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ReqResApiTests {

    @BeforeAll
    static void setup() {
        baseURI = "https://reqres.in";
    }

    // Test 1: Read (GET) - List Users
    @Test
    @Order(1)
    void listUsers_page2_shouldReturn200_andNonEmptyData() {
        given()
            .queryParam("page", 2)
        .when()
            .get("/api/users")
        .then()
            .statusCode(200)
            .body("page", equalTo(2))
            .body("data", not(empty()));
    }

    // Test 2: Create (POST) - Parameterized (Data-Driven)
    @ParameterizedTest
    @CsvSource({
        "John Doe,Software Tester",
        "Jane Smith,QA Engineer"
    })
    @Order(2)
    void createUser_shouldReturn201_andEchoFields_andHaveIdAndCreatedAt(String name, String job) {
        given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"" + name + "\",\"job\":\"" + job + "\"}")
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .body("name", equalTo(name))
            .body("job", equalTo(job))
            .body("id", notNullValue())
            .body("createdAt", notNullValue());
    }

    // Test 3: Update (PUT)
    @Test
    @Order(3)
    void updateUser_shouldReturn200_andUpdatedFields() {
        String name = "Updated User";
        String job = "Senior QA";

        given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"" + name + "\",\"job\":\"" + job + "\"}")
        .when()
            .put("/api/users/2")
        .then()
            .statusCode(200)
            .body("name", equalTo(name))
            .body("job", equalTo(job))
            .body("updatedAt", notNullValue());
    }

    // Test 4: Delete (DELETE)
    @Test
    @Order(4)
    void deleteUser_shouldReturn204() {
        when()
            .delete("/api/users/2")
        .then()
            .statusCode(204);
    }
}
