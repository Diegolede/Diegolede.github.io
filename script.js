const GITHUB_USERNAME = "Diegolede";

document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
    fetchRepos();
    setupCollapsible();
});

function setupCollapsible() {
    const toggle = document.getElementById("case-study-toggle");
    const content = document.getElementById("case-study-content");

    if (toggle && content) {
        toggle.addEventListener("click", () => {
            const isActive = toggle.classList.toggle("active");
            content.classList.toggle("open");

            // Optional: Toggle text
            const span = toggle.querySelector("span");
            if (span) {
                span.textContent = isActive ? "Ocultar detalles" : "Ver detalles del proceso";
            }
        });
    }
}

// Fetch GitHub Profile Data
async function fetchProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();

        updateElement("name", data.name || GITHUB_USERNAME);
        updateElement("username", `@${data.login}`);
        updateElement("bio", data.bio || "Desarrollador Full Stack. Entusiasta de los datos y la eficiencia.");

        // Avatar logic removed to use local GIF


        // Remove skeleton classes
        document.getElementById("name").classList.remove("skeleton-text");
        document.getElementById("username").classList.remove("skeleton-text");
        document.getElementById("bio").classList.remove("skeleton-text");

    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

// Fetch GitHub Repos
async function fetchRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`);
        if (!response.ok) throw new Error("Failed to fetch repos");

        const repos = await response.json();

        // Render projects
        const container = document.getElementById("projects-grid");
        container.innerHTML = ""; // Clear skeletons

        // Sort by pushed_at just in case API didn't sort perfectly
        repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        repos.forEach(repo => {
            // Optional: Skip forked repos if desired, but user said "all public repos"
            // if (repo.fork) return; 

            // Filter out specific repos
            if (repo.name.toLowerCase().includes("rene-pomodoro") ||
                repo.name.toLowerCase().includes("rene pomodoro") ||
                repo.name.toLowerCase() === "diegolede") return;

            const card = createProjectCard(repo);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching repos:", error);
        document.getElementById("projects-grid").innerHTML = "<p>Hubo un error cargando los proyectos.</p>";
    }
}

function createProjectCard(repo) {
    const article = document.createElement("article");
    article.className = "project-card";

    const description = repo.description || "Proyecto técnico";
    const language = repo.language || "Código";
    // Mapping language to color (simple version)
    const langColor = getLanguageColor(language);

    article.innerHTML = `
        <div class="project-top">
            <h3 class="project-title">${repo.name}</h3>
            <a href="${repo.html_url}" target="_blank" aria-label="Ver repo ${repo.name}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
            </a>
        </div>
        <p class="project-desc">${description}</p>
        <div class="project-lang">
            <span class="lang-dot" style="background-color: ${langColor}"></span>
            <span>${language}</span>
        </div>
    `;

    // Make the whole card clickable
    article.style.cursor = "pointer";
    article.onclick = (e) => {
        // Prevent if clicked on the SVG link specifically to avoid double open (though anchor handles it)
        if (!e.target.closest('a')) {
            window.open(repo.html_url, '_blank');
        }
    };

    return article;
}

function updateElement(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function getLanguageColor(lang) {
    const colors = {
        "Python": "#3572A5",
        "JavaScript": "#F7DF1E",
        "HTML": "#E34F26",
        "CSS": "#563D7C",
        "TypeScript": "#2b7489",
        "Java": "#b07219",
        "R": "#198CE7",
        "Shell": "#89e051"
    };
    return colors[lang] || "#888888";
}
