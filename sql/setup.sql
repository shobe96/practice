/*https://medium.com/code-with-farhan/spring-security-jwt-authentication-authorization-a2c6860be3cf*/

CREATE SCHEMA `employee`;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES on employee.* TO 'admin'@'localhost';

USE employee;

DELETE FROM employee;

DELETE FROM department;

DELETE FROM user_role;

DELETE FROM user;

DELETE FROM role;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
	user_id BIGINT NOT NULL AUTO_INCREMENT,
	login varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (user_id)
)

DROP TABLE IF EXISTS role;
CREATE TABLE IF NOT EXISTS role (
	role_id BIGINT NOT NULL AUTO_INCREMENT,
	code varchar(100) NOT NULL,
	name varchar(100) NULL,
	description varchar(100) NULL,
	CONSTRAINT role_pk PRIMARY KEY (role_id)
)

INSERT INTO role (description) VALUES
	 ('Regular employee with the lowest privileges'),
	 ('Employee with the highest privileges'),
	 ('Employee in charge of department');


DROP TABLE IF EXISTS user_role;
CREATE TABLE IF NOT EXISTS user_role (
	user_role_id BIGINT NOT NULL AUTO_INCREMENT,
	user_id BIGINT NULL,
	role_id BIGINT NULL,
	CONSTRAINT user_role_pk PRIMARY KEY (user_role_id),
	CONSTRAINT user_role_user_FK FOREIGN KEY (user_id) REFERENCES employee.`user`(user_id),
	CONSTRAINT user_role_role_FK FOREIGN KEY (role_id) REFERENCES employee.`role`(role_id)
)

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