-- Populate Rank_permission
INSERT INTO Rank_permission (rank) VALUES ('admin'), ('manager'), ('employee');

-- Populate Employment_status
INSERT INTO Employment_status (status) VALUES ('active'), ('suspended');

-- Populate Table_status
INSERT INTO Table_status (status) VALUES ('available'), ('occupied'), ('on-hold');

-- Populate Time_zone
INSERT INTO Time_zone (code) VALUES ('ADT'), ('AKDT'), ('AKST'), ('AST'), ('CDT'), ('CST'), ('EDT'), ('EST'), ('HDT'), ('HST'), ('MDT'), ('MST'), ('NDT'), ('NST'), ('PDT'), ('PST');

-- Populate Exit_code
INSERT INTO Exit_code (code, description) VALUES ('employee-exit', 'Exited by employee'), ('manager-exit', 'Exited by manager');

-- Populate Tab_status
INSERT INTO Tab_status (status) VALUES ('open'), ('resolved');

-- Populate Ticket_status
INSERT INTO Ticket_status (status) VALUES ('in-progress'), ('completed');