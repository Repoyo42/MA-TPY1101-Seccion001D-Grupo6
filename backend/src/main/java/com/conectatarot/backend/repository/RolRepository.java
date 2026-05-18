package com.conectatarot.backend.repository;

import com.conectatarot.backend.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    Optional<Rol> findByNombreRol(String nombreRol);
}