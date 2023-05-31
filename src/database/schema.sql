CREATE DATABASE workout;

CREATE EXTENSION "uuid-ossp";

CREATE TABLE teams(
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  members VARCHAR[]
);

CREATE TABLE accounts(
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
  FOREIGN KEY (teamId) REFERENCES teams(id)
);
