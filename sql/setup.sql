/*
https://medium.com/code-with-farhan/spring-security-jwt-authentication-authorization-a2c6860be3cf
https://www.javainuse.com/spring/boot-jwt-mysql
*/

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
	username varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	PRIMARY KEY (user_id)
)

DROP TABLE IF EXISTS role;
CREATE TABLE IF NOT EXISTS role (
	role_id BIGINT NOT NULL AUTO_INCREMENT,
	code varchar(100) NOT NULL,
	name varchar(100) NULL,
	description varchar(100) NULL,
	PRIMARY KEY (role_id)
)

INSERT INTO role (code, description) VALUES
	 ('EMP','Regular employee with the lowest privileges'),
	 ('ADM','Employee with the highest privileges'),
	 ('DCH','Employee in charge of department');


DROP TABLE IF EXISTS user_role;
CREATE TABLE IF NOT EXISTS user_role (
	user_role_id BIGINT NOT NULL AUTO_INCREMENT,
	user_id BIGINT NULL,
	role_id BIGINT NULL,
	PRIMARY KEY (user_role_id),
	FOREIGN KEY (user_id) REFERENCES employee.`user`(user_id),
	FOREIGN KEY (role_id) REFERENCES employee.`role`(role_id)
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
	user_id bigint DEFAULT NULL,
	skill_id bigint DEFAULT NULL,
    PRIMARY KEY (employee_id),
	FOREIGN KEY (user_id) 
		REFERENCES user (`user_id`),
    FOREIGN KEY (department_id)
        REFERENCES department (department_id)
);

DROP TABLE IF EXISTS skill;
CREATE TABLE IF NOT EXISTS skill (
	skill_id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	description varchar(100) NULL,
	PRIMARY KEY (skill_id)
);

DROP TABLE IF EXISTS employee_skill;
CREATE TABLE IF NOT EXISTS employee_skill (
	employee_skill_id BIGINT NOT NULL AUTO_INCREMENT,
	skill_id BIGINT DEFAULT NULL,
	employee_id BIGINT DEFAULT NULL,
	PRIMARY KEY (employee_skill_id),
	FOREIGN KEY (skill_id) 
		REFERENCES skill (`skill_id`),
    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id)
);

DROP TABLE IF EXISTS project;
CREATE TABLE IF NOT EXISTS project (
	project_id BIGINT NOT NULL AUTO_INCREMENT,
	name varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	code varchar(100) NOT NULL,
	PRIMARY KEY (project_id)
);

DROP TABLE IF EXISTS employee_project;
CREATE TABLE IF NOT EXISTS employee_project (
	employee_project_id BIGINT NOT NULL AUTO_INCREMENT,
	project_id BIGINT DEFAULT NULL,
	employee_id BIGINT DEFAULT NULL,
	PRIMARY KEY (employee_project_id),
	FOREIGN KEY (project_id) 
		REFERENCES project (`project_id`),
    FOREIGN KEY (employee_id)
        REFERENCES employee (employee_id)
);

DROP TABLE IF EXISTS project_skill;
CREATE TABLE IF NOT EXISTS project_skill (
	project_skill_id BIGINT NOT NULL AUTO_INCREMENT,
	project_id BIGINT DEFAULT NULL,
	skill_id BIGINT DEFAULT NULL,
	PRIMARY KEY (project_skill_id),
	FOREIGN KEY (project_id) 
		REFERENCES project (`project_id`),
    FOREIGN KEY (skill_id) 
		REFERENCES skill (`skill_id`)
);