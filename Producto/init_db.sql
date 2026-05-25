-- ============================================================
-- Script de Base de Datos - ConectaTarot
-- MA-TPY1101 - Seccion 001D - Grupo 6
-- MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS mi_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mi_app;

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE IF NOT EXISTS rol (
  id_rol INT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uk_nombre_rol (nombre_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  activo BIT(1) DEFAULT 1,
  rol_id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uk_email (email),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id_rol) REFERENCES rol (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tarotista (
  id INT NOT NULL AUTO_INCREMENT,
  nombre_profesional VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  precio_base DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'PENDIENTE',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuario_id (usuario_id),
  CONSTRAINT fk_tarotista_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS especialidad (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activa BIT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_nombre_especialidad (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tarotista_especialidad (
  id INT NOT NULL AUTO_INCREMENT,
  tarotista_id INT NOT NULL,
  especialidad_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tarotista_especialidad (tarotista_id, especialidad_id),
  CONSTRAINT fk_te_tarotista FOREIGN KEY (tarotista_id) REFERENCES tarotista (id) ON DELETE CASCADE,
  CONSTRAINT fk_te_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidad (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS disponibilidad_tarotista (
  id INT NOT NULL AUTO_INCREMENT,
  tarotista_id INT NOT NULL,
  dia_semana VARCHAR(20) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activa BIT(1) DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_disp_tarotista FOREIGN KEY (tarotista_id) REFERENCES tarotista (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sesion (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  tarotista_id INT NOT NULL,
  especialidad_id INT NOT NULL,
  fecha DATETIME NOT NULL,
  duracion_minutos INT NOT NULL DEFAULT 60,
  precio_total DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'PENDIENTE',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_sesion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id_usuario),
  CONSTRAINT fk_sesion_tarotista FOREIGN KEY (tarotista_id) REFERENCES tarotista (id),
  CONSTRAINT fk_sesion_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidad (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================================

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_obtener_tarotistas_activos()
BEGIN
  SELECT 
    t.id,
    t.nombre_profesional,
    t.descripcion,
    t.precio_base,
    t.estado,
    u.email,
    GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
  FROM tarotista t
  INNER JOIN usuario u ON t.usuario_id = u.id_usuario
  LEFT JOIN tarotista_especialidad te ON t.id = te.tarotista_id
  LEFT JOIN especialidad e ON te.especialidad_id = e.id
  WHERE t.estado = 'APROBADO' AND u.activo = 1
  GROUP BY t.id, t.nombre_profesional, t.descripcion, t.precio_base, t.estado, u.email;
END //

CREATE PROCEDURE IF NOT EXISTS sp_obtener_sesiones_usuario(IN p_usuario_id INT)
BEGIN
  SELECT 
    s.id,
    s.fecha,
    s.duracion_minutos,
    s.precio_total,
    s.estado,
    t.nombre_profesional AS tarotista,
    e.nombre AS especialidad
  FROM sesion s
  INNER JOIN tarotista t ON s.tarotista_id = t.id
  INNER JOIN especialidad e ON s.especialidad_id = e.id
  WHERE s.usuario_id = p_usuario_id
  ORDER BY s.fecha DESC;
END //

CREATE PROCEDURE IF NOT EXISTS sp_cancelar_sesion(
  IN p_sesion_id INT,
  IN p_usuario_id INT,
  OUT p_resultado VARCHAR(100)
)
BEGIN
  DECLARE v_owner INT;
  DECLARE v_estado VARCHAR(20);
  
  SELECT usuario_id, estado INTO v_owner, v_estado
  FROM sesion WHERE id = p_sesion_id;
  
  IF v_owner != p_usuario_id THEN
    SET p_resultado = 'ERROR: No tienes permiso para cancelar esta sesion';
  ELSEIF v_estado = 'CANCELADA' THEN
    SET p_resultado = 'ERROR: La sesion ya esta cancelada';
  ELSE
    UPDATE sesion SET estado = 'CANCELADA' WHERE id = p_sesion_id;
    SET p_resultado = 'OK: Sesion cancelada correctamente';
  END IF;
END //

CREATE PROCEDURE IF NOT EXISTS sp_disponibilidad_tarotista(IN p_tarotista_id INT)
BEGIN
  SELECT 
    dia_semana,
    hora_inicio,
    hora_fin,
    activa
  FROM disponibilidad_tarotista
  WHERE tarotista_id = p_tarotista_id AND activa = 1
  ORDER BY FIELD(dia_semana, 'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY');
END //

DELIMITER ;

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

INSERT INTO rol (nombre_rol) VALUES ('ADMIN'), ('CLIENTE'), ('TAROTISTA')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

-- Usuarios de prueba (passwords hasheados con BCrypt - valor: admin1234 / Test1234!)
INSERT INTO usuario (nombre, email, password, rol_id_rol) VALUES
('Admin Sistema', 'admin@conectatarot.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 1),
('Test Cliente', 'test@correo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
('Tarotista Test', 'tarotista@conectatarot.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Tarotista de prueba
INSERT INTO tarotista (nombre_profesional, descripcion, precio_base, estado, usuario_id)
SELECT 'Luna Estrellada', 'Especialista en Tarot Egipcio y Astrologia con 10 anios de experiencia', 15000.00, 'APROBADO', id_usuario
FROM usuario WHERE email = 'tarotista@conectatarot.com'
ON DUPLICATE KEY UPDATE nombre_profesional = VALUES(nombre_profesional);

-- Especialidades
INSERT INTO especialidad (nombre, descripcion, activa) VALUES
('Tarot General', 'Lectura general de cartas del tarot', 1),
('Tarot Egipcio', 'Lectura con baraja egipcia tradicional', 1),
('Astrologia', 'Lectura de cartas astrales y horoscopo', 1),
('Runas', 'Lectura de runas nordicas', 1),
('Tarot del Amor', 'Consultas especializadas en relaciones y amor', 1)
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Asignar especialidades al tarotista
INSERT INTO tarotista_especialidad (tarotista_id, especialidad_id)
SELECT t.id, e.id FROM tarotista t, especialidad e
WHERE t.nombre_profesional = 'Luna Estrellada' AND e.nombre IN ('Tarot General', 'Tarot Egipcio', 'Astrologia')
ON DUPLICATE KEY UPDATE tarotista_id = VALUES(tarotista_id);

-- Disponibilidad del tarotista (Lunes a Viernes 9:00 - 20:00)
INSERT INTO disponibilidad_tarotista (tarotista_id, dia_semana, hora_inicio, hora_fin, activa)
SELECT t.id, dias.dia, '09:00:00', '20:00:00', 1
FROM tarotista t
CROSS JOIN (
  SELECT 'MONDAY' AS dia UNION ALL SELECT 'TUESDAY' UNION ALL
  SELECT 'WEDNESDAY' UNION ALL SELECT 'THURSDAY' UNION ALL SELECT 'FRIDAY'
) dias
WHERE t.nombre_profesional = 'Luna Estrellada';

-- Sesion de prueba
INSERT INTO sesion (usuario_id, tarotista_id, especialidad_id, fecha, duracion_minutos, precio_total, estado)
SELECT u.id_usuario, t.id, e.id, '2026-06-01 15:00:00', 60, 15000.00, 'PENDIENTE'
FROM usuario u, tarotista t, especialidad e
WHERE u.email = 'test@correo.com'
AND t.nombre_profesional = 'Luna Estrellada'
AND e.nombre = 'Tarot General'
LIMIT 1;

-- ============================================================
-- VERIFICACION
-- ============================================================
SELECT 'Tablas creadas correctamente' AS estado;
SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'mi_app';
