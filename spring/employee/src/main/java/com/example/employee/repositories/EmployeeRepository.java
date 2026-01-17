package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.employee.models.Employee;

@Repository
public interface EmployeeRepository
		extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {

//	public Page<Employee> findAllByDepartmentId(Pageable pageable, Integer departmentId);
	
//	public List<Employee> findAllByDepartmentId(Integer departmentId);

//	@Query("SELECT e FROM Employee e WHERE (e.name LIKE CONCAT('%', :name, '%') OR e.name IS NULL) AND (e.surname LIKE CONCAT('%', :surname, '%') OR e.surname IS NULL) AND (e.email LIKE CONCAT('%', :email, '%') OR e.email IS NULL)")
//	public Page<Employee> searchEmployees(String name, String surname, String email, Pageable pageable);
	
//	@Query("SELECT COUNT(e) FROM Employee e WHERE e.name LIKE CONCAT('%', :name, '%') AND e.surname LIKE CONCAT('%', :surname, '%') AND e.email LIKE CONCAT('%', :email, '%')")
//	public Long searchResultCount(String name, String surname, String email);
	
	@Query("SELECT e FROM Employee e WHERE e.user.id IS NULL")
	public List<Employee> findEmployeesWithoutUser();
	
//	public Employee findByUserId(Integer userId);
	
//	@Query("SELECT e FROM Employee e JOIN e.skills s WHERE s.id IN :skillIds AND e.department.id = :departmentId")
//	public List<Employee> filterEmployeesByActiveAndSkills(List<Integer> skillIds, Integer departmentId);
	
	@Query(nativeQuery = true, value = "UPDATE employee.employee e SET e.department_id = NULL WHERE e.department_id = ?1")
	@Modifying
	public Integer unassignEmployeesFromDepartment(Integer departmentId);

	@Query(nativeQuery = true, value = "DELETE FROM employee.employee_project ep WHERE ep.employee_id = ?1")
	@Modifying
	public void deleteEmployeeProjects(Integer employeeId);
}
