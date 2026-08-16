import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    const [professionals, setProfessionals] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [professions, setProfessions] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);

    // Récupérer les données
    const fetchProfessionals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://192.168.1.13:3002/api/professionals');
            if (!response.ok) throw new Error('Erreur de connexion');
            const data = await response.json();
            setProfessionals(data);
            setFiltered(data);
        } catch (err) {
            setError('Impossible de charger les professionnels');
            console.error(err);
        }
        setLoading(false);
    };

    const fetchProfessions = async () => {
        try {
            const response = await fetch('http://192.168.1.13:3002/api/professions');
            if (!response.ok) throw new Error('Erreur');
            const data = await response.json();
            setProfessions(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProfessionals();
        fetchProfessions();
    }, []);

    // Recherche et filtrage
    useEffect(() => {
        let results = professionals;

        if (searchTerm) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.profession.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedProfession) {
            results = results.filter(p =>
                p.profession.toLowerCase() === selectedProfession.toLowerCase()
            );
        }

        setFiltered(results);
    }, [searchTerm, selectedProfession, professionals]);

    // Styles
    const styles = {
        container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
        header: { textAlign: 'center', marginBottom: '30px' },
        title: { color: '#2c3e50', fontSize: '2.5rem' },
        subtitle: { color: '#7f8c8d' },
        searchContainer: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
        searchInput: { flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', minWidth: '200px' },
        select: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', minWidth: '150px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
        card: { 
            background: 'white', 
            borderRadius: '12px', 
            padding: '20px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '1px solid #eee'
        },
        cardHover: { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        badge: { 
            display: 'inline-block', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '14px',
            backgroundColor: '#e8f4fd',
            color: '#3498db'
        },
        available: { color: '#27ae60' },
        unavailable: { color: '#e74c3c' },
        rating: { color: '#f39c12' },
        modal: {
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
        },
        closeBtn: {
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            float: 'right'
        },
        stats: { textAlign: 'center', color: '#7f8c8d', marginBottom: '20px' },
        error: { color: '#e74c3c', textAlign: 'center' },
        loading: { textAlign: 'center', padding: '50px' }
    };

    if (loading) return <div style={styles.loading}>Chargement des professionnels...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🔧 Annuaire des Professionnels</h1>
                <p style={styles.subtitle}>Trouvez le bon artisan pour vos travaux</p>
            </div>

            {/* Barre de recherche et filtres */}
            <div style={styles.searchContainer}>
                <input
                    style={styles.searchInput}
                    type="text"
                    placeholder="🔍 Rechercher un professionnel ou un métier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    style={styles.select}
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                >
                    <option value="">Tous les métiers</option>
                    {professions.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Statistiques */}
            <div style={styles.stats}>
                {filtered.length} professionnel{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                {selectedProfession && ` dans ${selectedProfession}`}
            </div>

            {/* Liste des professionnels */}
            <div style={styles.grid}>
                {filtered.map(pro => (
                    <div
                        key={pro.id}
                        style={styles.card}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onClick={() => setSelectedPro(pro)}
                    >
                        <h3 style={{ margin: '0 0 8px 0' }}>{pro.name}</h3>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={styles.badge}>{pro.profession}</span>
                        </div>
                        <div style={{ marginBottom: '4px' }}>📱 {pro.phone || 'Non renseigné'}</div>
                        <div style={{ marginBottom: '4px' }}>📧 {pro.email || 'Non renseigné'}</div>
                        <div style={{ marginBottom: '4px' }}>
                            ⭐ {pro.rating || 'N/A'} / 5
                        </div>
                        <div>
                            {pro.available ? 
                                <span style={styles.available}>✅ Disponible</span> : 
                                <span style={styles.unavailable}>❌ Indisponible</span>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Détails */}
            {selectedPro && (
                <div style={styles.modal} onClick={() => setSelectedPro(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setSelectedPro(null)}>✕</button>
                        <h2>{selectedPro.name}</h2>
                        <p><strong>Métier :</strong> {selectedPro.profession}</p>
                        <p><strong>Téléphone :</strong> {selectedPro.phone || 'Non renseigné'}</p>
                        <p><strong>Email :</strong> {selectedPro.email || 'Non renseigné'}</p>
                        <p><strong>Adresse :</strong> {selectedPro.address || 'Non renseignée'}</p>
                        <p><strong>Note :</strong> ⭐ {selectedPro.rating || 'N/A'} / 5</p>
                        <p><strong>Disponibilité :</strong> {selectedPro.available ? '✅ Disponible' : '❌ Indisponible'}</p>
                        {selectedPro.description && (
                            <p><strong>Description :</strong> {selectedPro.description}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
