class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen;
    }
}

// Función para obtener los agentes desde la API
async function getAgents() {
    const url = 'https://valorant-api.com/v1/agents';
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Verificamos que la respuesta contiene datos válidos
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid API response format');
        }

        // Convertimos los datos en instancias de la clase Agente
        return data.data.map(agent => 
            new Agente(
                agent.displayName,
                agent.role?.displayName || 'No role', // Verificar si existe el rol
                agent.abilities.map(ability => ability.displayName).filter(Boolean), // Habilidades válidas
                agent.displayIcon || '' // Usar un icono vacío si no existe
            )
        );
    } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
    }
}

// Función para renderizar agentes en el DOM
function renderAgents(agents) {
    const agentsContainer = document.getElementById('agents');
    agentsContainer.innerHTML = ''; // Limpiar contenido previo

    if (agents.length === 0) {
        agentsContainer.innerHTML = `<p>No agents found.</p>`;
        return;
    }

    agents.forEach(agent => {
        const agentCard = document.createElement('div');
        agentCard.classList.add('agent-card');

        agentCard.innerHTML = `
            <img src="${agent.imagen}" alt="${agent.nombre}">
            <h2>${agent.nombre}</h2>
            <p><strong>Role:</strong> ${agent.rol}</p>
            <p><strong>Abilities:</strong></p>
            <ul>${agent.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}</ul>
        `;

        agentsContainer.appendChild(agentCard);
    });
}

// Función para configurar la búsqueda en tiempo real
function setupSearch(agents) {
    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredAgents = agents.filter(agent => 
            agent.nombre.toLowerCase().includes(searchText)
        );
        renderAgents(filteredAgents);
    });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const agents = await getAgents();
        renderAgents(agents);
        setupSearch(agents);
    } catch (error) {
        console.error('Error initializing app:', error);
        const agentsContainer = document.getElementById('agents');
        agentsContainer.innerHTML = `<p>Error loading agents. Please try again later.</p>`;
    }
});
