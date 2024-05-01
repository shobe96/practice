package com.example.employee.utils;

import java.io.IOException;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.employee.models.RestError;
import com.example.employee.services.impl.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private JwtUtil jwtUtil;
	private UserDetailsServiceImpl userDetailsServiceImpl;

	@Autowired
	public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsServiceImpl) {
		this.jwtUtil = jwtUtil;
		this.userDetailsServiceImpl = userDetailsServiceImpl;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		try {
			String authHeader = request.getHeader("Authorization");
			String tokenParam = request.getParameter("token");
			String token = null;
			String username = null;
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7);
				username = jwtUtil.extractUsername(token);
			}

			if (tokenParam != null && !tokenParam.equals("")) {
				token = tokenParam;
				username = jwtUtil.extractUsername(token);
			}

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
				if (jwtUtil.validateToken(token, userDetails).equals(true)) {
					UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authenticationToken);
				}

			}

			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			RestError re = new RestError(HttpStatus.UNAUTHORIZED.value(),"Unauthorized", false, "HttpErrorResponse", "Token has expired. Login again.");
			OutputStream responseStream = response.getOutputStream();
	        ObjectMapper mapper = new ObjectMapper();
	        mapper.writeValue(responseStream, re);
	        responseStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
