/*
 https://medium.com/code-with-farhan/spring-security-jwt-authentication-authorization-a2c6860be3cf
 https://www.javainuse.com/spring/boot-jwt-mysql
 */
CREATE SCHEMA `employee`;

CREATE USER 'admin' @'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES on employee.* TO 'admin' @'localhost';

USE employee;

DELETE FROM
	employee;

DELETE FROM
	department;

DELETE FROM
	user_role;

DELETE FROM
	user;

DELETE FROM
	role;

DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT  `user` (
	`user_id` bigint NOT NULL AUTO_INCREMENT,
	`username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`password` varchar(100) NOT NULL,
	`salt` varchar(100) NOT NULL,
	PRIMARY KEY (`user_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS role;

CREATE TABLE IF NOT EXISTS `role` (
	`role_id` bigint NOT NULL AUTO_INCREMENT,
	`code` varchar(100) NOT NULL,
	`name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	PRIMARY KEY (`role_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
	role (code, description)
VALUES
	(
		'EMP',
		'Regular employee with the lowest privileges'
	),
	('ADM', 'Employee with the highest privileges'),
	('DCH', 'Employee in charge of department');

DROP TABLE IF EXISTS user_role;

CREATE TABLE IF NOT `user_role` (
	`user_role_id` bigint NOT NULL AUTO_INCREMENT,
	`user_id` bigint DEFAULT NULL,
	`role_id` bigint DEFAULT NULL,
	PRIMARY KEY (`user_role_id`),
	KEY `user_role_user_FK` (`user_id`),
	KEY `user_role_role_FK` (`role_id`),
	CONSTRAINT `user_role_role_FK` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`),
	CONSTRAINT `user_role_user_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `department` (
	`department_id` bigint NOT NULL AUTO_INCREMENT,
	`name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`add_user` varchar(25) DEFAULT NULL,
	`mod_user` varchar(25) DEFAULT NULL,
	`add_date` timestamp NULL DEFAULT NULL,
	`mod_date` timestamp NULL DEFAULT NULL,
	`active` tinyint(1) DEFAULT NULL,
	PRIMARY KEY (`department_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS employee;

CREATE TABLE IF NOT EXISTS `employee` (
	`employee_id` bigint NOT NULL AUTO_INCREMENT,
	`name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`surname` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`add_user` varchar(25) DEFAULT NULL,
	`mod_user` varchar(25) DEFAULT NULL,
	`add_date` timestamp NULL DEFAULT NULL,
	`mod_date` timestamp NULL DEFAULT NULL,
	`active` tinyint(1) DEFAULT NULL,
	`department_id` bigint DEFAULT NULL,
	`email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`user_id` bigint DEFAULT NULL,
	`assignment_date` timestamp NULL DEFAULT NULL,
	PRIMARY KEY (`employee_id`),
	KEY `department_id` (`department_id`),
	KEY `employee_user_FK` (`user_id`),
	CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
	CONSTRAINT `employee_user_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 41 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS skill;

CREATE TABLE IF NOT  `skill` (
	`skill_id` bigint NOT NULL AUTO_INCREMENT,
	`name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	PRIMARY KEY (`skill_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS employee_skill;

CREATE TABLE IF NOT EXISTS `employee_skill` (
	`employee_skill_id` bigint NOT NULL AUTO_INCREMENT,
	`skill_id` bigint DEFAULT NULL,
	`employee_id` bigint DEFAULT NULL,
	PRIMARY KEY (`employee_skill_id`),
	KEY `skill_id` (`skill_id`),
	KEY `employee_id` (`employee_id`),
	CONSTRAINT `employee_skill_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`skill_id`),
	CONSTRAINT `employee_skill_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 23 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS project;

CREATE TABLE IF NOT EXISTS `project` (
	`project_id` bigint NOT NULL AUTO_INCREMENT,
	`name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`active` tinyint(1) DEFAULT NULL,
	`department_id` bigint DEFAULT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	PRIMARY KEY (`project_id`),
	KEY `project_department_FK` (`department_id`),
	CONSTRAINT `project_department_FK` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS employee_project;

CREATE TABLE IF NOT EXISTS `employee_project` (
	`employee_project_id` bigint NOT NULL AUTO_INCREMENT,
	`project_id` bigint DEFAULT NULL,
	`employee_id` bigint DEFAULT NULL,
	PRIMARY KEY (`employee_project_id`),
	KEY `project_id` (`project_id`),
	KEY `employee_id` (`employee_id`),
	CONSTRAINT `employee_project_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
	CONSTRAINT `employee_project_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 35 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS project_skill;

CREATE TABLE IF NOT EXISTS `project_skill` (
	`project_skill_id` bigint NOT NULL AUTO_INCREMENT,
	`project_id` bigint DEFAULT NULL,
	`skill_id` bigint DEFAULT NULL,
	PRIMARY KEY (`project_skill_id`),
	KEY `project_id` (`project_id`),
	KEY `skill_id` (`skill_id`),
	CONSTRAINT `project_skill_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
	CONSTRAINT `project_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`skill_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 34 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `project_history` (
	`project_history_id` bigint NOT NULL AUTO_INCREMENT,
	`project_id` bigint DEFAULT NULL,
	`employee_id` bigint DEFAULT NULL,
	`end_date` timestamp NULL DEFAULT NULL,
	`start_date` timestamp NULL DEFAULT NULL,
	PRIMARY KEY (`project_history_id`),
	KEY `project_history_employee_FK` (`employee_id`),
	KEY `project_history_project_FK` (`project_id`),
	CONSTRAINT `project_history_employee_FK` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
	CONSTRAINT `project_history_project_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;