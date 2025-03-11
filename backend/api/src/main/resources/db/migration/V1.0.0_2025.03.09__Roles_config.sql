CREATE TABLE emoji
(
    id         serial  NOT NULL,
    discord_id bigint  NULL,
    name       text    NOT NULL,
    animated   boolean NULL,

    PRIMARY KEY (id)
);

CREATE TABLE roles_config
(
    id       serial NOT NULL,
    guild_id bigint NOT NULL,

    PRIMARY KEY (id)
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

CREATE TABLE role_message_component
(
    id         serial         NOT NULL,
    parent_id  int            NULL,
    message_id int            NULL,
    type       component_type NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (message_id) REFERENCES role_message
);

CREATE TABLE role_message_row
(
    component_id int NOT NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component
);

CREATE TYPE button_style AS ENUM ('PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER');

CREATE TABLE role_message_button
(
    component_id int          NOT NULL,
    role_name    text         NOT NULL,
    style        button_style NOT NULL,
    label        text         NOT NULL,
    emoji_id     int          NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component,
    FOREIGN KEY (emoji_id) REFERENCES emoji
);

CREATE TABLE role_message_select_menu
(
    component_id int,
    placeholder  text NULL,

    PRIMARY KEY (component_id),
    FOREIGN KEY (component_id) REFERENCES role_message_component
);

CREATE TABLE role_message_select_menu_choice
(
    menu_id     int  NOT NULL,
    -- Checking that each role is present once per message would require a trigger
    role_name   text NOT NULL,
    label       text NOT NULL,
    description text NULL,
    emoji_id    int  NULL,

    FOREIGN KEY (menu_id) REFERENCES role_message_select_menu,
    FOREIGN KEY (emoji_id) REFERENCES emoji
);