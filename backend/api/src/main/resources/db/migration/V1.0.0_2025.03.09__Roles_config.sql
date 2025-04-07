CREATE FUNCTION digits(value numeric) RETURNS INT AS
'SELECT ceil(log(value + 1))' LANGUAGE sql;

CREATE DOMAIN snowflake AS bigint CHECK (value > 0 AND digits(value) <= 20);

CREATE TYPE emoji_type AS ENUM ('UNICODE', 'CUSTOM');

CREATE TABLE emoji
(
    id         serial     NOT NULL,
    type       emoji_type NOT NULL,
    discord_id snowflake  NULL,
    name       text       NULL,
    unicode    text       NULL,
    animated   boolean    NULL,

    PRIMARY KEY (id)
);

CREATE TABLE roles_config
(
    id       serial    NOT NULL,
    guild_id snowflake NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (guild_id)
);

CREATE TABLE role_message
(
    id        serial NOT NULL,
    config_id int    NOT NULL,
    content   text   NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (config_id) REFERENCES roles_config
);

CREATE TYPE component_type AS ENUM ('ROW', 'BUTTON', 'SELECT_MENU');
CREATE CAST (character varying AS component_type) WITH INOUT AS IMPLICIT;

CREATE TABLE role_message_component
(
    id        serial         NOT NULL,
    parent_id int            NULL,
    type      component_type NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES role_message_component
);

CREATE TABLE role_message_role_message_component
(
    message_id   INT NOT NULL,
    component_id INT NOT NULL,

    PRIMARY KEY (message_id, component_id),
    FOREIGN KEY (message_id) REFERENCES role_message,
    FOREIGN KEY (component_id) REFERENCES role_message_component
);

CREATE TABLE role_message_row
(
    component_id int NOT NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component
);

CREATE TYPE button_style AS ENUM ('PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER');
CREATE CAST (character varying AS button_style) WITH INOUT AS IMPLICIT;

CREATE TABLE role_message_button
(
    component_id int          NOT NULL,
    role_name    text         NOT NULL,
    style        button_style NOT NULL,
    label        text         NULL,
    emoji_id     int          NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component,
    FOREIGN KEY (emoji_id) REFERENCES emoji
);

CREATE TABLE role_message_select_menu
(
    component_id int  NOT NULL,
    placeholder  text NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component
);

CREATE TABLE role_message_select_menu_choice
(
    id          serial NOT NULL,
    menu_id     int    NOT NULL,
    -- Checking that each role is present once per message would require a trigger
    role_name   text   NOT NULL,
    label       text   NOT NULL,
    description text   NULL,
    emoji_id    int    NULL,

    PRIMARY KEY (id),
    UNIQUE (menu_id, role_name),
    FOREIGN KEY (menu_id) REFERENCES role_message_select_menu,
    FOREIGN KEY (emoji_id) REFERENCES emoji
);