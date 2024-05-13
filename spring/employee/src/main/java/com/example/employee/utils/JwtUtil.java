package com.example.employee.utils;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.employee.models.AuthResponse;
import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.repositories.UserRepository;

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

	private UserRepository userRepository;
	private RoleRepository roleRepository;

	@Autowired
	public JwtUtil(UserRepository userRepository,RoleRepository roleRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

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

	public AuthResponse generateToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, username);
	}

	private AuthResponse createToken(Map<String, Object> claims, String username) {
		User user = userRepository.findByUsername(username);
		List<Role> roles = roleRepository.findRolesByUsersId(user.getId());
		AuthResponse authResponse = new AuthResponse();
		authResponse.setIssueDate(new Date(System.currentTimeMillis()));
		authResponse.setExpirationDate(new Date(System.currentTimeMillis() + accessTokenValidity));
		authResponse.setExpiration(accessTokenValidity);
		String token = Jwts.builder().setClaims(claims).setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
				.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
		authResponse.setToken(token);
		authResponse.setUsername(username);
		authResponse.setUserId(user.getId());
		authResponse.setRoles(roles);
		return authResponse;
	}

	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(securityKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}

}
