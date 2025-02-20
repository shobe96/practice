package com.example.employee.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.employee.repositories.RoleRepository;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.impl.UserDetailsServiceImpl;
import com.example.employee.utils.AuthoritiesConstants;
import com.example.employee.utils.CustomAccessDeniedHandler;
import com.example.employee.utils.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private JwtAuthFilter jwtAuthFilter;
	private UserRepository userRepository;
	private RoleRepository roleRepository;
	
	private AuthenticationEntryPoint authEntryPoint;
	private final CustomAccessDeniedHandler customAccessDeniedHandler;

	@Autowired
	public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserRepository userRepository, RoleRepository roleRepository, @Qualifier("customAuthenticationEntryPoint") AuthenticationEntryPoint authEntryPoint, CustomAccessDeniedHandler customAccessDeniedHandler) {
		this.customAccessDeniedHandler = customAccessDeniedHandler;
		this.jwtAuthFilter = jwtAuthFilter;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.authEntryPoint = authEntryPoint;
		}

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserDetailsServiceImpl(userRepository, roleRepository);
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return web -> web.ignoring().requestMatchers("/swagger-ui/**", "/v3/api-docs/**");
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.cors(cors -> cors.disable()).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/login").permitAll()
						.requestMatchers("/api/auth/register-user").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/auth/delete/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/employees/get-by-department/**").hasAnyAuthority(AuthoritiesConstants.DEPARTMENT_CHIEF)
						.requestMatchers("/api/employees/find-by-user/**").hasAnyAuthority(AuthoritiesConstants.ADMIN, AuthoritiesConstants.DEPARTMENT_CHIEF, AuthoritiesConstants.EMPLOYEE)
						.requestMatchers("/api/employees/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/users/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/departments/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/roles/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/skills/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/projects/get-project/**").hasAnyAuthority(AuthoritiesConstants.ADMIN, AuthoritiesConstants.DEPARTMENT_CHIEF, AuthoritiesConstants.EMPLOYEE)
						.requestMatchers("/api/projects/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
						.requestMatchers("/api/project-history/**").hasAnyAuthority(AuthoritiesConstants.ADMIN, AuthoritiesConstants.DEPARTMENT_CHIEF, AuthoritiesConstants.EMPLOYEE)
				)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.httpBasic(basic -> basic.authenticationEntryPoint(authEntryPoint))
				.exceptionHandling(customizer -> customizer.accessDeniedHandler(customAccessDeniedHandler))
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class).build();

	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;

	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

}
