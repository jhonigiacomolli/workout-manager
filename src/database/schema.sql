CREATE EXTENSION IF NOT EXISTS  "uuid-ossp";

CREATE TABLE IF NOT EXISTS teams(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  members VARCHAR[],
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR  NOT NULL,
  phone VARCHAR,
  address VARCHAR,
  responsability VARCHAR[],
  status VARCHAR[],
  permissions VARCHAR[],
  desktops VARCHAR[],
  boards VARCHAR[],
  tasks VARCHAR[],
  image VARCHAR,
  teamid UUID,
  FOREIGN KEY (teamId) REFERENCES teams(id),
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspaces(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP,
  title VARCHAR NOT NULL,
  description VARCHAR,
  boards VARCHAR[],
  members VARCHAR[],
  profileimage VARCHAR,
  coverimage VARCHAR
);

CREATE TABLE IF NOT EXISTS boards(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP,
  title VARCHAR NOT NULL,
  format VARCHAR,
  groups VARCHAR[]
);

CREATE TABLE IF NOT EXISTS groups(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP,
  title VARCHAR NOT NULL,
  elements VARCHAR[]
);

CREATE TABLE IF NOT EXISTS elements(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP,
  title VARCHAR NOT NULL,
  "group" VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  expected_date TIMESTAMP,
  members VARCHAR[],
  updates VARCHAR[]
);
