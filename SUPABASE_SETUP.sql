-- ============================================================
-- SUPABASE_SETUP.sql — Script de création des tables Hindo Digital
-- Coller dans : Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---- 1. Services ----
CREATE TABLE IF NOT EXISTS services (
  id          BIGSERIAL PRIMARY KEY,
  titre       TEXT NOT NULL,
  description TEXT NOT NULL,
  icone       TEXT NOT NULL DEFAULT 'wifi',
  image_path  TEXT,
  ordre       SMALLINT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 2. Réalisations ----
CREATE TABLE IF NOT EXISTS realisations (
  id          BIGSERIAL PRIMARY KEY,
  titre       TEXT NOT NULL,
  categorie   TEXT NOT NULL,
  image_path  TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 3. Formations ----
CREATE TABLE IF NOT EXISTS formations (
  id          BIGSERIAL PRIMARY KEY,
  titre       TEXT NOT NULL,
  description TEXT NOT NULL,
  duree       TEXT NOT NULL,
  niveau      TEXT NOT NULL CHECK (niveau IN ('Débutant', 'Intermédiaire', 'Avancé')),
  prix        INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 4. Inscriptions ----
CREATE TABLE IF NOT EXISTS inscriptions (
  id           BIGSERIAL PRIMARY KEY,
  nom          TEXT NOT NULL,
  email        TEXT NOT NULL,
  telephone    TEXT,
  formation_id BIGINT REFERENCES formations(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 5. Contacts ----
CREATE TABLE IF NOT EXISTS contacts (
  id         BIGSERIAL PRIMARY KEY,
  nom        TEXT NOT NULL,
  email      TEXT NOT NULL,
  telephone  TEXT,
  sujet      TEXT NOT NULL,
  message    TEXT NOT NULL,
  lu         BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 6. Newsletters ----
CREATE TABLE IF NOT EXISTS newsletters (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  actif      BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 7. Témoignages ----
CREATE TABLE IF NOT EXISTS temoignages (
  id         BIGSERIAL PRIMARY KEY,
  nom        TEXT NOT NULL,
  poste      TEXT,
  texte      TEXT NOT NULL,
  note       SMALLINT DEFAULT 5 CHECK (note BETWEEN 1 AND 5),
  actif      BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 8. Vidéos ----
CREATE TABLE IF NOT EXISTS videos (
  id               BIGSERIAL PRIMARY KEY,
  titre            TEXT NOT NULL,
  description      TEXT,
  url_video        TEXT NOT NULL,
  video_file_path  TEXT,
  type             TEXT NOT NULL DEFAULT 'youtube' CHECK (type IN ('youtube', 'vimeo', 'fichier')),
  categorie        TEXT,
  thumbnail_path   TEXT,
  actif            BOOLEAN DEFAULT TRUE,
  ordre            SMALLINT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ---- 9. Settings (logo, contenu CMS) ----
CREATE TABLE IF NOT EXISTS settings (
  id         BIGSERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public : lecture seule sur les données du site
-- Admin  : accès complet après authentification Supabase Auth
-- ============================================================

ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE realisations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters   ENABLE ROW LEVEL SECURITY;
ALTER TABLE temoignages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings      ENABLE ROW LEVEL SECURITY;

-- Lecture publique (site vitrine)
CREATE POLICY "Lecture publique services"      ON services      FOR SELECT USING (true);
CREATE POLICY "Lecture publique realisations"  ON realisations  FOR SELECT USING (true);
CREATE POLICY "Lecture publique formations"    ON formations    FOR SELECT USING (true);
CREATE POLICY "Lecture publique temoignages"   ON temoignages   FOR SELECT USING (actif = true);
CREATE POLICY "Lecture publique videos"        ON videos        FOR SELECT USING (actif = true);
CREATE POLICY "Lecture publique settings"      ON settings      FOR SELECT USING (true);

-- Insertion publique (formulaires de contact, inscription, newsletter)
CREATE POLICY "Insertion publique contacts"    ON contacts     FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion publique inscriptions"ON inscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion publique newsletters" ON newsletters  FOR INSERT WITH CHECK (true);
CREATE POLICY "Upsert publique newsletters"    ON newsletters  FOR UPDATE USING (true);

-- Accès complet pour les utilisateurs authentifiés (admin)
CREATE POLICY "Admin complet services"      ON services      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet realisations"  ON realisations  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet formations"    ON formations    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet inscriptions"  ON inscriptions  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet contacts"      ON contacts      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet newsletters"   ON newsletters   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet temoignages"   ON temoignages   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet videos"        ON videos        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin complet settings"      ON settings      FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================================

INSERT INTO services (titre, description, icone, ordre) VALUES
  ('Réseaux & Systèmes',              'Installation et maintenance de réseaux informatiques locaux et distants.', 'wifi',     1),
  ('Sécurité & Vidéosurveillance',    'Mise en place de systèmes de surveillance et protection des locaux.',       'shield',   2),
  ('Développement Web & Mobile',      'Création de sites web et applications mobiles sur mesure.',                 'code',     3),
  ('Formation Informatique',          'Formations pratiques en informatique pour tous les niveaux.',               'academic', 4),
  ('Infographie',                     'Conception graphique, identité visuelle, supports de communication.',       'color',    5)
ON CONFLICT DO NOTHING;

INSERT INTO temoignages (nom, poste, texte, note, actif) VALUES
  ('Mamadou Diallo', 'Directeur, PME Ziguinchor',      'Hindo Digital a transformé notre infrastructure réseau. Service professionnel et résultats dépassant nos attentes !', 5, true),
  ('Fatou Mbaye',    'Gérante, Boutique Ziguinchor',   'Notre site e-commerce a été livré dans les délais avec une qualité remarquable. Les ventes ont augmenté de 40% !',    5, true),
  ('Ibrahima Sow',   'Responsable IT, ONG Ziguinchor', 'Les formations Hindo Digital ont boosté les compétences de mon équipe. Formateurs très pédagogues.',                   5, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- REALTIME — Active les mises à jour en temps réel sur settings
-- Nécessaire pour que les changements admin s'affichent immédiatement
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE realisations;
ALTER PUBLICATION supabase_realtime ADD TABLE temoignages;
ALTER PUBLICATION supabase_realtime ADD TABLE videos;

-- ============================================================
-- STORAGE POLICIES — Permissions d'upload pour les admins
-- Exécuter APRÈS avoir créé le bucket "hindo-media" (Public)
-- ============================================================

-- Lecture publique de tous les fichiers du bucket
CREATE POLICY "Lecture publique hindo-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hindo-media');

-- Upload autorisé pour les utilisateurs connectés (admins)
CREATE POLICY "Admin peut uploader"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hindo-media' AND auth.role() = 'authenticated');

-- Modification autorisée pour les admins
CREATE POLICY "Admin peut modifier fichier"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hindo-media' AND auth.role() = 'authenticated');

-- Suppression autorisée pour les admins
CREATE POLICY "Admin peut supprimer fichier"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hindo-media' AND auth.role() = 'authenticated');

-- ============================================================
-- STORAGE — Bucket pour les fichiers (images, vidéos, logos)
-- À créer dans : Supabase Dashboard → Storage → New bucket
-- Nom : hindo-media | Public : OUI
-- ============================================================
