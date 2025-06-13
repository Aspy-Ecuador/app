-- Tablas
-- Roles y usuarios
CREATE TABLE IF NOT EXISTS role (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP
);


CREATE TABLE IF NOT EXISTS gender (
    gender_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS occupation (
    occupation_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS marital_status (
    marital_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS education (
    education_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS country (
    country_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_code VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS state (
    state_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(country_id)
);

CREATE TABLE IF NOT EXISTS city (
    city_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state_id INT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES state(state_id)
);

CREATE TABLE IF NOT EXISTS aga (
    aga_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_account_status (
    status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment_status (
    status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_status (
    status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS user_account (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id INT NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status INT NOT NULL,
    last_login TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (status) REFERENCES user_account_status(status_id)
);

-- Persona y relaciones
CREATE TABLE IF NOT EXISTS person (
    person_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    birthdate DATE NOT NULL,
    gender INT NOT NULL,
    occupation INT NOT NULL,
    marital_status INT NOT NULL,
    education INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id),
    FOREIGN KEY (gender) REFERENCES gender(gender_id),
    FOREIGN KEY (occupation) REFERENCES occupation(occupation_id),
    FOREIGN KEY (marital_status) REFERENCES marital_status(marital_status_id),
    FOREIGN KEY (education) REFERENCES education(education_id)
);

CREATE TABLE IF NOT EXISTS client (
    person_id INT PRIMARY KEY,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

CREATE TABLE IF NOT EXISTS staff (
    person_id INT PRIMARY KEY,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

CREATE TABLE IF NOT EXISTS professional (
    person_id INT PRIMARY KEY,
    specialty VARCHAR(255) NOT NULL,
    title VARCHAR(50) NOT NULL,
    about TEXT,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

-- Identificación y direcciones
CREATE TABLE IF NOT EXISTS identification (
    identification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    number VARCHAR(13) UNIQUE NOT NULL,
    due_date TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

CREATE TABLE IF NOT EXISTS address (
    address_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    country INT NOT NULL,
    province INT NOT NULL,
    city INT NOT NULL,
    primary_address TEXT NOT NULL,
    secondary_address TEXT,
    aga INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id),
    FOREIGN KEY (country) REFERENCES country(country_id),
    FOREIGN KEY (province) REFERENCES state(state_id),
    FOREIGN KEY (city) REFERENCES city(city_id),
    FOREIGN KEY (aga) REFERENCES aga(aga_id)
);

-- Teléfonos
CREATE TABLE IF NOT EXISTS phone (
    phone_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    relationship VARCHAR(50) NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

-- Perfil médico
CREATE TABLE IF NOT EXISTS medical_profile (
    medical_profile_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id INT NOT NULL,
    diagnose VARCHAR(255) UNIQUE NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES client(person_id)
);

-- Agendamiento
CREATE TABLE IF NOT EXISTS schedule (
    schedule_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    name VARCHAR(255),
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worker_schedule (
    worker_schedule_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    schedule_id INT NOT NULL,
    person_id INT NOT NULL,
    is_available BOOLEAN NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id),
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

-- Servicios y profesionales
CREATE TABLE IF NOT EXISTS discount (
    discount_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    discount INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service (
    service_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS professional_service (
    professional_service_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    service_id INT NOT NULL,
    person_id INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES service(service_id),
    FOREIGN KEY (person_id) REFERENCES professional(person_id)
);

-- Datos de pago y recibos
CREATE TABLE IF NOT EXISTS payment_data (
    payment_data_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    number INT NOT NULL,
    file VARCHAR(255) UNIQUE NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id INT NOT NULL,
    service_id INT NOT NULL,
    discount_id INT,
    payment_data_id INT NOT NULL,
    service_price DECIMAL(10, 2) NOT NULL,     -- Copia del precio base en el momento del pago
    discount_percentage INT,                   -- Porcentaje descontado (si aplica)
    total_amount DECIMAL(10, 2) NOT NULL,      -- Monto final pagado
    status INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES client(person_id),
    FOREIGN KEY (service_id) REFERENCES service(service_id),
    FOREIGN KEY (discount_id) REFERENCES discount(discount_id),
    FOREIGN KEY (payment_data_id) REFERENCES payment_data(payment_data_id),
    FOREIGN KEY (status) REFERENCES payment_status(status_id)
);

CREATE TABLE IF NOT EXISTS receipt (
    receipt_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    payment_id INT UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    payment_id INT NOT NULL,
    scheduled_by INT NOT NULL,
    worker_schedule_id INT UNIQUE NOT NULL,
    tracking_appointment INT UNIQUE,
    status INT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
    FOREIGN KEY (scheduled_by) REFERENCES person(person_id),
    FOREIGN KEY (worker_schedule_id) REFERENCES worker_schedule(worker_schedule_id),
    FOREIGN KEY (tracking_appointment) REFERENCES appointment(appointment_id),
    FOREIGN KEY (status) REFERENCES appointment_status(status_id)
);

CREATE TABLE IF NOT EXISTS appointment_report (
    appointment_report_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    appointment_id INT UNIQUE NOT NULL,
    comments TEXT NOT NULL,
    sign VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) DEFAULT 'system',
    modified_by VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR PRIMARY KEY,
    token VARCHAR NOT NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR PRIMARY KEY,
    value TEXT,
    expiration INT
);

CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR PRIMARY KEY,
    owner VARCHAR NOT NULL,
    expiration INT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    queue VARCHAR NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT UNSIGNED NOT NULL,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL,
    CONSTRAINT queue_index FOREIGN KEY(queue) REFERENCES queue(queue)
);

CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    total_jobs INT NOT NULL,
    pending_jobs INT NOT NULL,
    failed_jobs INT NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INT NULL,
    created_at INT NOT NULL,
    finished_at INT NULL
);

CREATE TABLE IF NOT EXISTS failed_jobs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id SERIAL PRIMARY KEY,
    tokenable_type VARCHAR NOT NULL,
    tokenable_id INT NOT NULL,
    name VARCHAR NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tokenable UNIQUE (tokenable_type, tokenable_id)
);

-- INDICES
CREATE INDEX idx_user_account_role_id ON user_account(role_id);
CREATE INDEX idx_user_account_status ON user_account(status);
CREATE INDEX idx_person_user_id ON person(user_id);
CREATE INDEX idx_person_gender ON person(gender);
CREATE INDEX idx_person_occupation ON person(occupation);
CREATE INDEX idx_person_marital_status ON person(marital_status);
CREATE INDEX idx_person_education ON person(education);
CREATE INDEX idx_identification_person_id ON identification(person_id);
CREATE INDEX idx_identification_type ON identification(type);
CREATE INDEX idx_address_person_id ON address(person_id);
CREATE INDEX idx_address_type ON address(type);
CREATE INDEX idx_address_country ON address(country);
CREATE INDEX idx_address_province ON address(province);
CREATE INDEX idx_address_city ON address(city);
CREATE INDEX idx_address_aga ON address(aga);
CREATE INDEX idx_phone_person_id ON phone(person_id);
CREATE INDEX idx_phone_type ON phone(type);
CREATE INDEX idx_phone_relationship ON phone(relationship);
CREATE INDEX idx_medical_profile_person_id ON medical_profile(person_id);
CREATE INDEX idx_schedule_date ON schedule(date);
CREATE INDEX idx_worker_schedule_schedule_id ON worker_schedule(schedule_id);
CREATE INDEX idx_worker_schedule_person_id ON worker_schedule(person_id);
CREATE INDEX idx_discount_name ON discount(name);
CREATE INDEX idx_service_name ON service(name);
CREATE INDEX idx_professional_service_service_id ON professional_service(service_id);
CREATE INDEX idx_professional_service_person_id ON professional_service(person_id);
CREATE INDEX idx_payment_person_id ON payment(person_id);
CREATE INDEX idx_payment_service_id ON payment(service_id);
CREATE INDEX idx_payment_discount_id ON payment(discount_id);
CREATE INDEX idx_payment_payment_data_id ON payment(payment_data_id);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_receipt_payment_id ON receipt(payment_id);
CREATE INDEX idx_receipt_status ON receipt(status);
CREATE INDEX idx_appointment_payment_id ON appointment(payment_id);
CREATE INDEX idx_appointment_scheduled_by ON appointment(scheduled_by);
CREATE INDEX idx_appointment_worker_schedule_id ON appointment(worker_schedule_id);
CREATE INDEX idx_appointment_tracking_appointment ON appointment(tracking_appointment);
CREATE INDEX idx_appointment_status ON appointment(status);
CREATE INDEX idx_appointment_report_appointment_id ON appointment_report(appointment_id);
CREATE INDEX idx_gender_name ON gender(name);
CREATE INDEX idx_occupation_name ON occupation(name);
CREATE INDEX idx_marital_status_name ON marital_status(name);
CREATE INDEX idx_education_name ON education(name);
CREATE INDEX idx_country_name ON country(name);
CREATE INDEX idx_state_name ON state(name);
CREATE INDEX idx_city_name ON city(name);
CREATE INDEX idx_aga_name ON aga(name);
CREATE INDEX idx_user_account_status_name ON user_account_status(name);
CREATE INDEX idx_appointment_status_name ON appointment_status(name);
CREATE INDEX idx_payment_status_name ON payment_status(name);
CREATE INDEX sessions_user_id_index ON sessions(user_id);
CREATE INDEX sessions_last_activity_index ON sessions(last_activity);

-- CHECK CONSTRAINTS
ALTER TABLE user_account
ADD CONSTRAINT chk_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE person
ADD CONSTRAINT chk_birthdate_past
CHECK (birthdate <= CURRENT_DATE);

ALTER TABLE schedule
ADD CONSTRAINT chk_schedule_time
CHECK (start_time >= TIME '07:00:00' AND end_time <= TIME '21:00:00' AND start_time < end_time);

ALTER TABLE worker_schedule
ADD CONSTRAINT uniq_schedule_person
UNIQUE (schedule_id, person_id);

ALTER TABLE discount
ADD CONSTRAINT chk_discount_percentage
CHECK (discount >= 0 AND discount <= 100);

ALTER TABLE service
ADD CONSTRAINT chk_service_price
CHECK (price >= 0);

ALTER TABLE payment
ADD CONSTRAINT chk_total_amount
CHECK (total_amount >= 0);

ALTER TABLE phone
ADD CONSTRAINT chk_phone_number
CHECK (number ~ '^\d{8,10}$');

ALTER TABLE address
ADD CONSTRAINT chk_address_country_province_city
CHECK (country IS NOT NULL AND province IS NOT NULL AND city IS NOT NULL);

-- Insercion de datos de prueba, crea registros en todas las tablas necesarias para el funcionamiento del sistema en orden de evitar errores de integridad referencial.
-- Inserción de cuentas de usuario
-- Roles
INSERT INTO role (name) VALUES ('Admin'), ('Professional'), ('Client'), ('Staff');

-- Estados para user_account_status
INSERT INTO user_account_status (name) VALUES ('Active'), ('Inactive');

-- Estados para appointment_status
INSERT INTO appointment_status (name) VALUES ('Scheduled'), ('Completed'), ('Cancelled');

-- Estados para payment_status
INSERT INTO payment_status (name) VALUES ('Pending'), ('Paid'), ('Failed');

-- Géneros
INSERT INTO gender (name) VALUES ('Masculino'), ('Femenino');

-- Ocupaciones
INSERT INTO occupation (name) VALUES ('Doctor'), ('Enfermero'), ('Ingeniero'), ('Estudiante');

-- Estado civil
INSERT INTO marital_status (name) VALUES ('Soltero'), ('Casado'), ('Divorciado');

-- Educación
INSERT INTO education (name) VALUES ('Secundaria'), ('Pregrado'), ('Postgrado');

-- País, Provincia, Ciudad (ejemplo mínimo)
INSERT INTO country (name, phone_code) VALUES ('Ecuador', '+593');
INSERT INTO state (name, country_id) VALUES ('Pichincha', 1);
INSERT INTO city (name, state_id) VALUES ('Quito', 1);

-- AGA (Áreas Geográficas)
INSERT INTO aga (name) VALUES 
('Zona 1: Esmeraldas, Imbabura, Carchi, Sucumbíos'),
('Zona 2: Pichincha (excepto Quito), Napo, Orellana'),
('Zona 3: Cotopaxi, Tungurahua, Chimborazo, Pastaza'),
('Zona 4: Manabí, Santo Domingo de los Tsáchilas'),
('Zona 5: Santa Elena, Guayas (excepto Guayaquil, Samborondón y Durán), Bolívar, Los Ríos, Galápagos'),
('Zona 6: Cañar, Azuay, Morona Santiago'),
('Zona 7: El Oro, Loja, Zamora Chinchipe'),
('Zona 8: Guayaquil, Samborondón y Durán'),
('Zona 9: Distrito Metropolitano de Quito');

-- Usuarios
-- Habilitar la extensión pgcrypto para funciones de hash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Las contraseñas deben almacenarse cifradas (hash). Ejemplo usando SHA-256 para propósitos de demostración:
INSERT INTO user_account (role_id, email, password_hash, status)
VALUES 
(1, 'admin@aspy.com', encode(digest('admin', 'sha256'), 'hex'), 1),   -- Admin
(2, 'doc1@aspy.com', encode(digest('doc1', 'sha256'), 'hex'), 1),    -- Profesional
(3, 'client1@aspy.com', encode(digest('client1', 'sha256'), 'hex'), 1), -- Cliente
(4, 'staff1@aspy.com', encode(digest('staff1', 'sha256'), 'hex'), 1);  -- Staff

-- Personas
INSERT INTO person (user_id, first_name, middle_name, birthdate, gender, occupation, marital_status, education)
VALUES
(1, 'Administrador', NULL, '1980-01-01', 1, 3, 2, 3),
(2, 'Juan', 'Carlos', '1975-05-10', 1, 1, 2, 3),
(3, 'María', NULL, '1990-12-20', 2, 4, 1, 2),
(4, 'Luisa', NULL, '1985-07-15', 2, 2, 1, 2);

-- Clientes, Staff y Profesionales
INSERT INTO staff (person_id) VALUES (1);
INSERT INTO professional (person_id, specialty, title) VALUES (2, 'Cardiología', 'Médico');
INSERT INTO client (person_id) VALUES (3);
INSERT INTO staff (person_id) VALUES (4);

-- Identificaciones (solo cliente ejemplo)
INSERT INTO identification (person_id, type, number)
VALUES (3, 'Cedula', '1712345678');

-- Direcciones (ejemplo para cliente)
INSERT INTO address (person_id, type, country, province, city, primary_address, aga)
VALUES (3, 'Domicilio', 1, 1, 1, 'Av. Siempre Viva 742', 1);

-- Teléfonos
INSERT INTO phone (person_id, type, number, relationship)
VALUES
(3, 'Personal', '0998765432', 'Cliente'),
(4, 'Trabajo', '0991234567', 'Staff');

-- Servicios y descuentos
INSERT INTO discount (name, discount) VALUES ('Descuento Promo', 10);
INSERT INTO service (name, price) VALUES ('Consulta General', 50.00);

-- Vincular profesional con servicio
INSERT INTO professional_service (service_id, person_id) VALUES (1, 2);

-- Agendas y horarios
INSERT INTO schedule (date, start_time, end_time, name) VALUES ('2025-05-10', '08:00:00', '09:00:00', 'Turno mañana');

INSERT INTO worker_schedule (schedule_id, person_id, is_available) VALUES (1, 2, TRUE); -- Profesional disponible

INSERT INTO worker_schedule (schedule_id, person_id, is_available) VALUES (1, 4, TRUE); -- Staff disponible

-- Método de pago
INSERT INTO payment_data (type, number, file) VALUES ('Tarjeta Crédito', 123456789, 'file_path');

-- Pago (con precio de servicio copiado)
INSERT INTO payment (person_id, service_id, discount_id, payment_data_id, service_price, discount_percentage, total_amount, status)
VALUES (3, 1, 1, 1, 50.00, 10, 45.00, 2); -- Cliente 1 pago

-- Recibo
INSERT INTO receipt (payment_id, status) VALUES (1, 'Emitido');

-- Cita
INSERT INTO appointment (payment_id, scheduled_by, worker_schedule_id, status)
VALUES (1, 1, 1, 1); -- Cita para el pago 1, programada por persona_id 1, worker_schedule 1

-- Reporte de cita
INSERT INTO appointment_report (appointment_id, comments, sign)
VALUES (1, 'Todo en orden', 'Firma Digital');

-- Finalización de inserciones