CREATE DATABASE pdv;

CREATE TABLE usuarios(
	id serial PRIMARY KEY,
	nome text,
	email text UNIQUE,
  senha text
);

CREATE TABLE categorias (
	id serial PRIMARY KEY,
  descricao text
);

CREATE TABLE produtos (
  id serial PRIMARY KEY,
  descricao text NOT NULL,
  quantidade_estoque integer NOT NULL,
  valor numeric NOT NULL,
  categoria_id integer REFERENCES categorias(id) NOT NULL,
  produto_imagem text
);

CREATE TABLE clientes (
  id serial PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL,
  cpf text NOT NULL,
  cep integer,
  rua text,
  numero numeric,
  bairro text,
  cidade text,
  estado char(2),
  UNIQUE (email, cpf)
);

CREATE TABLE pedidos (
  id serial PRIMARY KEY,
  cliente_id integer REFERENCES clientes(id) NOT NULL,
  observacao text, 
  valor_total integer NOT NULL
  );

CREATE TABLE pedido_produtos (
  id serial PRIMARY KEY,
  pedido_id integer REFERENCES pedidos(id),
  produto_id integer REFERENCES produtos(id) NOT NULL,
  quantidade_produto numeric NOT NULL,
  valor_produto numeric NOT NULL
);