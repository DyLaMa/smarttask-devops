import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>SmartTask</h1>
            <p>Application de gestion de taches</p>
            <p>Frontend connecte au backend !</p>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
