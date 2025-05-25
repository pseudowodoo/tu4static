const cardsContainer = document.getElementById('cardsContainer');
const categoryFilter = document.getElementById('categoryFilter');
let projects = [];

function createCard(project) {
  const imgSrc = `img/${project.n}.jpg`;
  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = project.title || 'Project Image';
  img.className = "w-full h-48 object-cover rounded-t";
  img.onerror = function() {
    this.remove();
    const fallback = document.createElement('div');
    fallback.className = "w-full h-48 bg-gray-700 flex items-center justify-center rounded-t";
    fallback.innerHTML = `<span class="text-gray-400 text-xl">No Image</span>`;
    this.parentNode.prepend(fallback);
  };

  const card = document.createElement('div');
  card.className = "bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col";
  card.appendChild(img);

  const content = document.createElement('div');
  content.className = "p-4 flex-1 flex flex-col";

  const title = document.createElement('h2');
  title.className = "text-xl font-semibold mb-2";
  title.textContent = project.name || 'Untitled';

  const desc = document.createElement('p');
  desc.className = "text-gray-400 mb-4 flex-1";
  desc.textContent = project.summary || '';

  const category = document.createElement('span');
  category.className = "inline-block bg-white text-gray-800 text-xs px-3 py-1 rounded-full mb-4 font-semibold shadow";
  category.textContent = project.category || 'Uncategorized';
  category.style.width = 'max-content';

  content.appendChild(title);
  content.appendChild(category);
  content.appendChild(desc);
  

  // Add Visit App button if website exists
  if (project.website) {
    const btn = document.createElement('a');
    btn.href = project.website;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "mt-auto inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors text-center";
    btn.textContent = "Visit App";
    content.appendChild(btn);
  }

  card.appendChild(content);
  return card;
}

function renderCards(filteredProjects) {
  cardsContainer.innerHTML = '';
  if (filteredProjects.length === 0) {
    cardsContainer.innerHTML = '<div class="col-span-full text-center text-gray-400">No projects found.</div>';
    return;
  }
  filteredProjects.forEach(project => {
    cardsContainer.appendChild(createCard(project));
  });
}

function populateCategories(projects) {
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  categories.sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

categoryFilter.addEventListener('change', () => {
  const selected = categoryFilter.value;
  if (selected === 'all') {
    renderCards(projects);
  } else {
    renderCards(projects.filter(p => p.category === selected));
  }
});

fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
    populateCategories(projects);
    renderCards(projects);
  })
  .catch(() => {
    cardsContainer.innerHTML = '<div class="col-span-full text-center text-red-400">Failed to load projects.</div>';
  });