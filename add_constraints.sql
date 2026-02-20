-- Add unique constraints for conflict resolution
ALTER TABLE boats ADD CONSTRAINT boats_name_unique UNIQUE (name);
ALTER TABLE dive_sites ADD CONSTRAINT dive_sites_name_unique UNIQUE (name);
ALTER TABLE instructors ADD CONSTRAINT instructors_email_unique UNIQUE (email);
