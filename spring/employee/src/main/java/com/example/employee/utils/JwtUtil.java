package com.example.employee.utils;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import com.example.employee.models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

	@Value("${secret.key}")
	private String securityKey;

	private long accessTokenValidity = 60 * 60 * 1000;

	private final JwtParser jwtParser;

	private final String TOKEN_HEADER = "Authorization";
	private final String TOKEN_PREFIX = "Bearer ";

	public JwtUtil(JwtParser jwtParser) {
		this.jwtParser = Jwts.parser().setSigningKey(securityKey);
	}

	public String createToken(User user) {
		Claims claims = Jwts.claims().setSubject(user.getLogin());
		Date tokenCreateTime = new Date();
		Date tokenValidity = new Date(tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(accessTokenValidity));
		return Jwts.builder().setClaims(claims).setExpiration(tokenValidity)
				.signWith(SignatureAlgorithm.HS256, securityKey).compact();
	}

	public Claims parseJwtClaims(String token) {
		return jwtParser.parseClaimsJws(token).getBody();
	}

	public Claims resolveClaims(HttpServletRequest request) {
		try {
			String token = resolveToken(request);
			if (token != null) {
				return parseJwtClaims(token);
			}
			return null;
		} catch (ExpiredJwtException e) {
			request.setAttribute("expired", e.getMessage());
			e.printStackTrace();
			throw e;
		} catch (Exception e) {
			request.setAttribute("invalid", e.getMessage());
			e.printStackTrace();
			throw e;
		}
	}

	public String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(TOKEN_HEADER);
		if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
			return bearerToken.substring(TOKEN_PREFIX.length());
		}
		return null;
	}

	public boolean validateClaims(Claims claims) throws AuthenticationException {
		try {
			return claims.getExpiration().after(new Date());
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	public String getLogin(Claims claims) {
		return claims.getSubject();
	}

}
