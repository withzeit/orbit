-- Seed data for Phase 3 local testing (run after all migrations).
-- Run: psql "$DATABASE_URL" -f apps/api/scripts/dev-seed.sql

INSERT INTO users (id, email, password_hash, name)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@orbit.local',
  'not-used-in-dev',
  'Demo User'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO workspaces (id, user_id, name, slug, type)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Personal',
  'personal',
  'personal'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, workspace_id, name, color, sort_order)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Launch Orbit',
  '#4f6ef7',
  0
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, project_id, user_id, title, description, status, priority, due_date, sort_order)
VALUES
  (
    '44444444-4444-4444-4444-444444444401',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Write README',
    'Document Phase 3 tasks API',
    'done',
    'medium',
    CURRENT_DATE - 1,
    0
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Ship kanban board',
    NULL,
    'in_progress',
    'high',
    CURRENT_DATE,
    1
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Add optimistic updates',
    NULL,
    'todo',
    'low',
    CURRENT_DATE + 7,
    2
  )
ON CONFLICT (id) DO NOTHING;
