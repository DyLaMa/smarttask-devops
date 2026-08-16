const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'task_user',
    password: process.env.POSTGRES_PASSWORD || 'task_password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB || 'smarttask_db',
});

// Initialisation de la base de données
async function initDatabase() {
    try {
        // Création de la table des professionnels
        await pool.query(`
            CREATE TABLE IF NOT EXISTS professionals (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                profession VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                address TEXT,
                rating DECIMAL(2,1) DEFAULT 0,
                available BOOLEAN DEFAULT true,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insertion des données de test
        const result = await pool.query('SELECT COUNT(*) FROM professionals');
        if (parseInt(result.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO professionals (name, profession, phone, email, address, rating, available, description) VALUES
                ('Jean Dupont', 'Plombier', '06 12 34 56 78', 'jean.dupont@email.fr', '12 rue de Paris, 75001 Paris', 4.8, true, 'Plombier expérimenté depuis 15 ans. Spécialiste des fuites et installations sanitaires.'),
                ('Marie Martin', 'Électricienne', '06 23 45 67 89', 'marie.martin@email.fr', '45 avenue de la République, 75002 Paris', 4.9, true, 'Électricienne certifiée. Interventions résidentielles et professionnelles.'),
                ('Pierre Dubois', 'Menuisier', '06 34 56 78 90', 'pierre.dubois@email.fr', '78 rue de Lyon, 75003 Paris', 4.7, true, 'Menuisier artisanal. Fabrication et rénovation de meubles sur mesure.'),
                ('Sophie Lambert', 'Peintre', '06 45 67 89 01', 'sophie.lambert@email.fr', '23 boulevard Voltaire, 75004 Paris', 4.6, false, 'Peintre en bâtiment. Spécialiste des finitions et décoration intérieure.'),
                ('Michel Roux', 'Maçon', '06 56 78 90 12', 'michel.roux@email.fr', '56 rue de la Paix, 75005 Paris', 4.5, true, 'Maçon professionnel. Construction et rénovation de murs, cloisons, fondations.'),
                ('Isabelle Moreau', 'Jardinier', '06 67 89 01 23', 'isabelle.moreau@email.fr', '34 avenue des Champs-Élysées, 75006 Paris', 4.8, true, 'Jardinier paysagiste. Création et entretien d''espaces verts.'),
                ('Lucas Petit', 'Serrurier', '06 78 90 12 34', 'lucas.petit@email.fr', '67 rue de Rennes, 75007 Paris', 4.4, true, 'Serrurier disponible 24h/24. Spécialiste des ouvertures de portes et installation de serrures.'),
                ('Emma Bernard', 'Nettoyeuse', '06 89 01 23 45', 'emma.bernard@email.fr', '89 rue de la Convention, 75008 Paris', 4.3, true, 'Entreprise de nettoyage professionnel. Interventions après travaux, chantiers, etc.')
            `);
            console.log('✅ Données de test insérées !');
        }
        console.log('✅ Base de données initialisée');
    } catch (err) {
        console.error('❌ Erreur d\'initialisation:', err.message);
    }
}

// Routes API
app.get('/', (req, res) => {
    res.json({ message: 'Annuaire de Professionnels API v2.0' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET /api/professionals - Liste complète
app.get('/api/professionals', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM professionals ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/professionals/search - Recherche par profession ou nom
app.get('/api/professionals/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Paramètre de recherche manquant' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM professionals 
             WHERE LOWER(name) LIKE LOWER($1) 
                OR LOWER(profession) LIKE LOWER($1)
             ORDER BY name`,
            [`%${q}%`]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/professionals/filter/:profession - Filtre par profession
app.get('/api/professionals/filter/:profession', async (req, res) => {
    const { profession } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM professionals WHERE LOWER(profession) = LOWER($1) ORDER BY name',
            [profession]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/professionals/:id - Détails d'un professionnel
app.get('/api/professionals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM professionals WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Professionnel non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/professions - Liste des métiers disponibles
app.get('/api/professions', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT profession FROM professionals ORDER BY profession'
        );
        res.json(result.rows.map(row => row.profession));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', async () => {
    await initDatabase();
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
