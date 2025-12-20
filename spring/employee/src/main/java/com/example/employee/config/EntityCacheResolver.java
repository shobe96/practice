package com.example.employee.config;

import java.util.Collection;
import java.util.Collections;

import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheOperationInvocationContext;
import org.springframework.cache.interceptor.SimpleCacheResolver;
import org.springframework.stereotype.Component;

@Component("entityCacheResolver")
public class EntityCacheResolver extends SimpleCacheResolver {
	
	public EntityCacheResolver(CacheManager cacheManager) {
        super(cacheManager);
    }
	
	@Override
    protected Collection<String> getCacheNames(CacheOperationInvocationContext<?> context) {
        // Get the actual class name (e.g., EmployeeServiceImpl)
        String className = context.getTarget().getClass().getSimpleName();
        
        // Transform "EmployeeServiceImpl" into "employees"
        String cacheName = className.replace("ServiceImpl", "s").toLowerCase();
        
        return Collections.singletonList(cacheName);
    }

}
