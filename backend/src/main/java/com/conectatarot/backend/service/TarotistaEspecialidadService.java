package com.conectatarot.backend.service;

import com.conectatarot.backend.dto.TarotistaEspecialidadResponseDTO;
import com.conectatarot.backend.entity.Especialidad;
import com.conectatarot.backend.entity.Tarotista;
import com.conectatarot.backend.entity.TarotistaEspecialidad;
import com.conectatarot.backend.exception.BadRequestException;
import com.conectatarot.backend.exception.ConflictException;
import com.conectatarot.backend.exception.NotFoundException;
import com.conectatarot.backend.repository.EspecialidadRepository;
import com.conectatarot.backend.repository.TarotistaEspecialidadRepository;
import com.conectatarot.backend.repository.TarotistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarotistaEspecialidadService {

    private final TarotistaRepository tarotistaRepository;
    private final EspecialidadRepository especialidadRepository;
    private final TarotistaEspecialidadRepository repository;

    public TarotistaEspecialidadResponseDTO agregarEspecialidad(
            Integer tarotistaId,
            Integer especialidadId
    ) {

        Tarotista tarotista = tarotistaRepository.findById(tarotistaId)
                .orElseThrow(() ->
                        new NotFoundException("Tarotista no encontrado")
                );

        Especialidad especialidad = especialidadRepository.findById(especialidadId)
                .orElseThrow(() ->
                        new NotFoundException("Especialidad no encontrada")
                );

        boolean yaExiste =
                repository.existsByTarotista_IdAndEspecialidad_Id(
                        tarotistaId,
                        especialidadId
                );

        if (yaExiste) {

            throw new ConflictException(
                    "El tarotista ya tiene esta especialidad"
            );
        }

        TarotistaEspecialidad relacion =
                TarotistaEspecialidad.builder()
                        .tarotista(tarotista)
                        .especialidad(especialidad)
                        .build();

        return convertirADTO(
                repository.save(relacion)
        );
    }

    public void eliminarEspecialidad(
            Integer tarotistaId,
            Integer especialidadId
    ) {

        TarotistaEspecialidad relacion =
                repository.findByTarotista_IdAndEspecialidad_Id(
                                tarotistaId,
                                especialidadId
                        )
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Especialidad no asignada al tarotista"
                                )
                        );

        long totalEspecialidades =
                repository.countByTarotista_Id(tarotistaId);

        if (totalEspecialidades <= 1) {

            throw new BadRequestException(
                    "El tarotista debe tener al menos una especialidad"
            );
        }

        repository.delete(relacion);
    }

    public List<TarotistaEspecialidadResponseDTO> listarEspecialidades(
            Integer tarotistaId
    ) {

        if (!tarotistaRepository.existsById(tarotistaId)) {

            throw new NotFoundException(
                    "Tarotista no encontrado"
            );
        }

        return repository.findByTarotista_Id(tarotistaId)
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    private TarotistaEspecialidadResponseDTO convertirADTO(
            TarotistaEspecialidad relacion
    ) {

        return TarotistaEspecialidadResponseDTO.builder()
                .id(relacion.getId())
                .especialidadId(
                        relacion.getEspecialidad().getId()
                )
                .nombre(
                        relacion.getEspecialidad().getNombre()
                )
                .descripcion(
                        relacion.getEspecialidad().getDescripcion()
                )
                .build();
    }
}