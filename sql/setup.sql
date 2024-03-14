CREATE SCHEMA `employee`;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES on employee.* TO 'admin'@'localhost';

USE employee;

DELETE FROM employee;

DELETE FROM department;

DROP TABLE IF EXISTS department;
CREATE TABLE IF NOT EXISTS department (
    department_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    add_user VARCHAR(25),
    mod_user VARCHAR(25),
    add_date TIMESTAMP,
    mod_date TIMESTAMP,
    active BOOLEAN,
    PRIMARY KEY (department_id)
);

DROP TABLE IF EXISTS employee;
CREATE TABLE IF NOT EXISTS employee (
    employee_id BIGINT NOT NULL AUTO_INCREMENT,
    name varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    surname varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    add_user VARCHAR(25),
    mod_user VARCHAR(25),
    add_date TIMESTAMP,
    mod_date TIMESTAMP,
    active BOOLEAN,
    department_id BIGINT,
    email varchar(50) DEFAULT NULL,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (department_id)
        REFERENCES department (department_id)
);