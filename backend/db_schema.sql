PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;


CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  full_name TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE, 
  password_hash TEXT NOT NULL, 
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
  session_id INTEGER PRIMARY KEY, 
  user_id INTEGER NOT NULL, 
  session_token TEXT NOT NULL UNIQUE, 
  expiration_time TIMESTAMP NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS subjects (
  subject_id INTEGER PRIMARY KEY, 
  subject_name TEXT NOT NULL, 
  user_id INTEGER,  
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  assignment_id INTEGER PRIMARY KEY, 
  title TEXT NOT NULL, 
  subject_id INTEGER, 
  user_id INTEGER, 
  due_date DATE NOT NULL, 
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')), 
  description TEXT, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS assignment_audit_log (
  log_id INTEGER PRIMARY KEY, 
  assignment_id INTEGER, 
  user_id INTEGER, 
  action TEXT NOT NULL, 
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS recurrence_options (
  option_id INTEGER PRIMARY KEY, 
  option_name TEXT NOT NULL UNIQUE
);

INSERT INTO recurrence_options (option_name) VALUES ('Daily'), ('Weekly'), ('Monthly'), ('Yearly');

CREATE TABLE IF NOT EXISTS revision_sessions (
  session_id INTEGER PRIMARY KEY, 
  user_id INTEGER NOT NULL, 
  subject_id INTEGER, 
  subject_topic TEXT NOT NULL, 
  start_datetime DATETIME NOT NULL, 
  duration_minutes INTEGER NOT NULL, 
  description TEXT, 
  recurrence_option_id INTEGER, 
  recurrence_end_date DATE, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (user_id) REFERENCES users(user_id), 
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id), 
  FOREIGN KEY (recurrence_option_id) REFERENCES recurrence_options(option_id)
);

CREATE TABLE IF NOT EXISTS revision_session_notifications (
  notification_id INTEGER PRIMARY KEY, 
  session_id INTEGER NOT NULL, 
  user_id INTEGER NOT NULL, 
  notification_datetime DATETIME NOT NULL, 
  message TEXT, 
  is_read BOOLEAN NOT NULL DEFAULT 0, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (session_id) REFERENCES revision_sessions(session_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS study_materials (
  material_id INTEGER PRIMARY KEY, 
  user_id INTEGER NOT NULL, 
  subject_id INTEGER, 
  material_type TEXT NOT NULL CHECK (material_type IN ('Text', 'Document', 'Link',
  'Image')),
  title TEXT NOT NULL,
  file_path TEXT,
  link_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

CREATE TABLE IF NOT EXISTS material_tags (
  tag_id INTEGER PRIMARY KEY,
  material_id INTEGER NOT NULL,
  tag_name TEXT NOT NULL,
  FOREIGN KEY (material_id) REFERENCES study_materials(material_id)
);

CREATE TABLE IF NOT EXISTS material_versions (
  version_id INTEGER PRIMARY KEY,
  material_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES study_materials(material_id)
);

CREATE TABLE IF NOT EXISTS task_timers (
  timer_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  total_duration_minutes INTEGER,
  is_paused BOOLEAN NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

CREATE TABLE IF NOT EXISTS user_feedback (
  feedback_id INTEGER PRIMARY KEY,
  user_id INTEGER,
  feedback_text TEXT NOT NULL,
  contact_email TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'In Progress', 'Resolved')),
  submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolution_timestamp TIMESTAMP,
  resolution_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


COMMIT;
