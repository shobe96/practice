package com.example.employee.utils;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.employee.models.AuthResponse;
import com.example.employee.models.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${secret.key}")
	private String securityKey;

	@Value("${secret.jwt.expiration.ms}")
	private long accessTokenValidity;

	private Logger logger = LoggerFactory.getLogger(JwtUtil.class);

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
	}

	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	public Boolean validateToken(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	public AuthResponse generateToken(Authentication authentication) {
		Map<String, Object> claims = new HashMap<>();
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		ObjectMapper objectMapper = new ObjectMapper();
		User user;
		try {
			String json = ow.writeValueAsString(authentication.getDetails());
			user = objectMapper.readValue(json, User.class);
			return createToken(claims, user);
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage());
			return null;
		}
	}

	private AuthResponse createToken(Map<String, Object> claims, User user) {
		if (user != null) {
			AuthResponse authResponse = new AuthResponse();
			authResponse.setIssueDate(new Date(System.currentTimeMillis()));
			authResponse.setExpirationDate(new Date(System.currentTimeMillis() + accessTokenValidity));
			authResponse.setExpiration(accessTokenValidity);
			String token = Jwts.builder().setClaims(claims).setSubject(user.getUsername())
					.setIssuedAt(new Date(System.currentTimeMillis()))
					.setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
					.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
			authResponse.setToken(token);
			authResponse.setUsername(user.getUsername());
			authResponse.setUserId(user.getId());
			authResponse.setRoles(user.getRoles());
			return authResponse;
		} else {
			return null;
		}
		
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(securityKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
