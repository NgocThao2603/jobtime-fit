-- Tạo bảng calendar
CREATE TABLE calendar (
  id CHAR(36) PRIMARY KEY,
  day VARCHAR(20) UNIQUE,
  time JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng job_infos
CREATE TABLE job_infos (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  salary VARCHAR(100),
  type ENUM('full_time', 'part_time', 'intern'),
  location VARCHAR(255),
  min_sessions_per_week INT,
  requires_experience BOOLEAN,
  holiday_off BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng job_times
CREATE TABLE job_times (
  id CHAR(36) PRIMARY KEY,
  job_info_id CHAR(36),
  day VARCHAR(20),
  shifts JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_info_id) REFERENCES job_infos(id),
  UNIQUE (job_info_id, day)
);

-- Thêm dữ liệu vào bảng job_infos
INSERT INTO job_infos (id, title, salary, type, location, min_sessions_per_week, requires_experience, holiday_off) VALUES
  (UUID(), 'Gia sư học sinh lớp 5', '10–15 triệu', 'part_time', 'Đống Đa, Hà Nội', 3, TRUE, TRUE),
  (UUID(), 'Phục vụ quán cà phê', 'Thỏa thuận', 'part_time', 'Cầu Giấy, Hà Nội', 7, FALSE, FALSE),
  (UUID(), 'Thực tập Marketing', '3–5 triệu', 'intern', 'Hai Bà Trưng, Hà Nội', 5, FALSE, TRUE),
  (UUID(), 'Chăm sóc khách hàng', '8–12 triệu', 'full_time', 'Thanh Xuân, Hà Nội', 10, TRUE, TRUE),
  (UUID(), 'Gia sư tiếng Anh', '12 triệu', 'part_time', 'Ba Đình, Hà Nội', 3, TRUE, FALSE);

-- Thêm dữ liệu vào bảng calendar
INSERT INTO calendar (id, day, time) VALUES
  (UUID(), 'Thứ Hai', JSON_ARRAY(JSON_OBJECT('start', '08:00', 'end', '12:00'))),
  (UUID(), 'Thứ Ba', JSON_ARRAY(JSON_OBJECT('start', '14:00', 'end', '18:00'))),
  (UUID(), 'Thứ Tư', JSON_ARRAY(JSON_OBJECT('start', '09:00', 'end', '11:00'), JSON_OBJECT('start', '13:00', 'end', '15:00'))),
  (UUID(), 'Thứ Sáu', JSON_ARRAY(JSON_OBJECT('start', '10:00', 'end', '16:00'))),
  (UUID(), 'Chủ Nhật', JSON_ARRAY(JSON_OBJECT('start', '08:00', 'end', '10:00')));

-- Thêm dữ liệu vào bảng job_times
INSERT INTO job_times (id, job_info_id, day, shifts) VALUES
  (UUID(), (SELECT id FROM job_infos WHERE title = 'Gia sư học sinh lớp 5'), 'Thứ Hai', JSON_ARRAY(JSON_OBJECT('start', '08:00', 'end', '11:00'))),
  (UUID(), (SELECT id FROM job_infos WHERE title = 'Phục vụ quán cà phê'), 'Thứ Ba', JSON_ARRAY(JSON_OBJECT('start', '14:00', 'end', '18:00'))),
  (UUID(), (SELECT id FROM job_infos WHERE title = 'Thực tập Marketing'), 'Thứ Tư', JSON_ARRAY(JSON_OBJECT('start', '09:00', 'end', '10:30'))),
  (UUID(), (SELECT id FROM job_infos WHERE title = 'Chăm sóc khách hàng'), 'Thứ Sáu', JSON_ARRAY(JSON_OBJECT('start', '10:00', 'end', '15:00'))),
  (UUID(), (SELECT id FROM job_infos WHERE title = 'Gia sư tiếng Anh'), 'Thứ Bảy', JSON_ARRAY(JSON_OBJECT('start', '09:00', 'end', '11:00'), JSON_OBJECT('start', '14:00', 'end', '17:00')));
