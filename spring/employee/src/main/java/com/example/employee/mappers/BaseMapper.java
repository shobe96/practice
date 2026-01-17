package com.example.employee.mappers;

import java.util.List;

public interface BaseMapper<T, D> {
	D toDto(T entity);
    T toEntity(D dto);
    List<D> toDtoList(List<T> entities);
    List<T> toEntityList(List<D> dtos);
}
