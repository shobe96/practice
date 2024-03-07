package com.example.employee.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.Department;
import com.example.employee.services.DepartmentService;

@RestController
@RequestMapping("/api")
public class DepartmentController {

	@Autowired
	private DepartmentService departmentService;

	@GetMapping("/departments")
	public ResponseEntity<List<Department>> getAllDepartments(Pageable pageable) {
		Page<Department> departments = departmentService.getAllDepartments(pageable);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(departments.getContent());
	}

	@GetMapping("/departments/get-one/{departmentId}")
	public ResponseEntity<Department> getDepartmentById(@PathVariable Integer departmentId) {
		Department department = departmentService.getDepartmentById(departmentId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(department);
	}

	@GetMapping("/departments/get-by-name")
	public ResponseEntity<Department> getByDepartmentName(@RequestParam String name) {
		Department departments = departmentService.getByDepartmentName(name);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(departments);
	}

	@PostMapping("/departments/create")
	public ResponseEntity<Department> saveDepartment(@RequestBody Department department) {
		Department newDepartment = departmentService.saveDepartment(department);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(newDepartment);
	}

	@PutMapping("/departments/update")
	public ResponseEntity<Department> updateDepartment(@RequestBody Department department) {
		Department newDepartment = departmentService.updateDepartment(department);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(newDepartment);
	}

	@DeleteMapping("/departments/get-one/{departmentId}")
	public ResponseEntity<Void> deleteDepartment(@PathVariable Integer departmentId) {
		departmentService.deleteDepartment(departmentId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(null);
	}

}
