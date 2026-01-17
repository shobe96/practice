package com.example.employee.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "project_history")
@Getter
@Setter
@ToString
public class ProjectHistory {

	@Id
	@Column(name = "project_history_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "start_date")
	private Date startDate;

	@ManyToOne()
	@JoinColumn(name = "employee_id")
	@JsonIgnoreProperties("projectHistories")
	private Employee employee;

	@ManyToOne()
	@JoinColumn(name = "project_id")
	@JsonIgnoreProperties("projectHistories")
	private Project project;
}
