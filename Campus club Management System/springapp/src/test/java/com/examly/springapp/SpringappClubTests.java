package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappClubTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------
    @Order(1)
    @Test
    void AddClubReturns200() throws Exception {
        String clubData = """
                {
                    "clubName": "Computer Science Association",
                    "category": "Technical",
                    "description": "A club for computer science students to learn programming and participate in hackathons",
                    "presidentEmail": "president@csa.edu",
                    "memberCount": 150,
                    "establishedDate": "2020-09-15",
                    "status": "Active"
                }
                """;

        mockMvc.perform(post("/api/clubs/addClub")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(clubData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllClubsReturnsArray() throws Exception {
        mockMvc.perform(get("/api/clubs/allClubs")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetClubByIdReturns200() throws Exception {
        mockMvc.perform(get("/api/clubs/1")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clubName").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void UpdateClubReturns200() throws Exception {
        String updatedData = """
                {
                    "clubName": "Computer Science Association",
                    "category": "Technical",
                    "description": "A premier club for computer science students focusing on AI and machine learning",
                    "presidentEmail": "president@csa.edu",
                    "memberCount": 200,
                    "establishedDate": "2020-09-15",
                    "status": "Active"
                }
                """;

        mockMvc.perform(put("/api/clubs/1")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberCount").value(200))
                .andReturn();
    }

    @Order(5)
    @Test
    void DeleteClubReturns200() throws Exception {
        mockMvc.perform(delete("/api/clubs/1")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

    // ---------- Project Structure Tests ----------
    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ClubControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/ClubController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ClubModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Club.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ClubServiceClassExists() {
        checkClassExists("com.examly.springapp.service.ClubService");
    }

    @Test
    void ClubModelClassExists() {
        checkClassExists("com.examly.springapp.model.Club");
    }

    @Test
    void ClubModelHasClubNameField() {
        checkFieldExists("com.examly.springapp.model.Club", "clubName");
    }

    @Test
    void ClubModelHasCategoryField() {
        checkFieldExists("com.examly.springapp.model.Club", "category");
    }

    @Test
    void ClubModelHasDescriptionField() {
        checkFieldExists("com.examly.springapp.model.Club", "description");
    }

    @Test
    void ClubModelHasPresidentEmailField() {
        checkFieldExists("com.examly.springapp.model.Club", "presidentEmail");
    }

    @Test
    void ClubModelHasMemberCountField() {
        checkFieldExists("com.examly.springapp.model.Club", "memberCount");
    }

    @Test
    void ClubModelHasEstablishedDateField() {
        checkFieldExists("com.examly.springapp.model.Club", "establishedDate");
    }

    @Test
    void ClubModelHasStatusField() {
        checkFieldExists("com.examly.springapp.model.Club", "status");
    }

    @Test
    void ClubRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.ClubRepository",
                "org.springframework.data.jpa.repository.JpaRepository");
    }

    @Test
    void ClubNotFoundExceptionClassExists() {
        checkClassExists("com.examly.springapp.exception.ClubNotFoundException");
    }

    @Test
    void ClubNotFoundExceptionExtendsRuntimeException() {
        try {
            Class<?> clazz = Class.forName("com.examly.springapp.exception.ClubNotFoundException");
            assertTrue(RuntimeException.class.isAssignableFrom(clazz),
                    "ClubNotFoundException should extend RuntimeException");
        } catch (ClassNotFoundException e) {
            fail("ClubNotFoundException class does not exist.");
        }
    }

    // ---------- Helpers ----------
    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }
}