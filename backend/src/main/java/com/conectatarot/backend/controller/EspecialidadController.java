package com.conectatarot.backend.controller;

import com.conectatarot.backend.dto.ApiResponse;
import com.conectatarot.backend.entity.Especialidad;
import com.conectatarot.backend.repository.EspecialidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
public class EspecialidadController {

    private final EspecialidadRepository especialidadRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Especialidad>>> listarEspecialidades() {
        List<Especialidad> especialidades = especialidadRepository.findAll();

        return ResponseEntity.ok(
                ApiResponse.ok("Especialidades obtenidas correctamente", especialidades)
        );
    }
}