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
  teamId UUID,
  FOREIGN KEY (teamId) REFERENCES teams(id),
  created_at TIMESTAMP
);
