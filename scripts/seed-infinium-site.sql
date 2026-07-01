INSERT INTO site (id, name, domain, isActive, integrationKey, createdAt, updatedAt)
VALUES ('infinium', 'The Infinium', 'infinium.local', 1, 'gkey_infinium_frontend_2026', NOW(), NOW())
ON DUPLICATE KEY UPDATE name='The Infinium', isActive=1, integrationKey='gkey_infinium_frontend_2026', updatedAt=NOW();

INSERT INTO GlobalSettings (id, siteId, createdAt, updatedAt, websiteSettings, navigation, header, footer)
VALUES (
  'gs_infinium',
  'infinium',
  NOW(),
  NOW(),
  '{"title":"The Infinium","tagline":"Exposing Lending Lies. Empowering Business Truths.","logoUrl":"/Logo.png","favicon":"/favicon.ico"}',
  '[]',
  '{"logoUrl":"/Logo.png","navItems":[]}',
  '{"copyright":"2026 The Infinium. All rights reserved.","links":[]}'
)
ON DUPLICATE KEY UPDATE siteId='infinium', updatedAt=NOW();

SELECT id, name, domain, integrationKey, isActive FROM site WHERE id='infinium';
SELECT id, siteId FROM GlobalSettings WHERE siteId='infinium';
