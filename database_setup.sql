CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_change_id` int(11) NOT NULL,
  `image` longblob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `testbeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `acronym` varchar(45) NOT NULL,
  `enabled` tinyint(4) DEFAULT 1,
  `description` text,
  `sort_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `testbed_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testbed_id` int(11) NOT NULL,
  `email_notifications_list` text DEFAULT NULL,
  `recently_changed_indicator_enabled` tinyint(4) DEFAULT NULL,
  `recently_changed_indicator_days` int(11) DEFAULT NULL,
  `testbed_edit_group` varchar(45) DEFAULT NULL,
  `auto_refresh_enabled` tinyint(4) DEFAULT NULL,
  `auto_refresh_interval` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `testbed_id_UNIQUE` (`testbed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `testbed_settings_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testbed_settings_id` int(11) NOT NULL,
  `email_notifications_list` text DEFAULT NULL,
  `recently_changed_indicator_enabled` tinyint(4) DEFAULT NULL,
  `recently_changed_indicator_days` int(11) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `testbed-db`.`item_status_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_status_id` INT NOT NULL,
  `testbed_id` INT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `color` VARCHAR(45) NOT NULL,
  `sort_order` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `item_metadata_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_metadata_id` int(11) NOT NULL,
  `testbed_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `fullname` varchar(45) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `online` tinyint(4) NOT NULL DEFAULT '1',
  `locked` tinyint(4) NOT NULL DEFAULT '0',
  `sort_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item_metadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testbed_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `deleted` tinyint(11) NOT NULL DEFAULT '0',
  `online` tinyint(4) NOT NULL DEFAULT '1',
  `locked` tinyint(11) NOT NULL DEFAULT '0',
  `sort_order` int(11) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testbed_id` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item_changes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `description` text,
  `version` varchar(255) DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `part_number` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rationale` text,
  `online` tinyint(4) NOT NULL DEFAULT '1',
  `image` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `metadata_key_idx` (`item_id`),
  CONSTRAINT `metadata_key` FOREIGN KEY (`item_id`) REFERENCES `item_metadata` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item_changes_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_changes_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `description` text,
  `image` tinyint(4) DEFAULT NULL,
  `part_number` varchar(45) DEFAULT NULL,
  `online` tinyint(4) NOT NULL,
  `rationale` text,
  `serial_number` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `version` varchar(45) DEFAULT NULL,
  `updated` timestamp NOT NULL,
  `username` varchar(45) NOT NULL,
  `modified_by` varchar(45) NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

