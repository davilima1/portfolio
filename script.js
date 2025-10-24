// Minimal interactivity: nav switching + sidebar expand + skill animation
document.addEventListener('DOMContentLoaded', () => {
  // NAV links
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      navLinks.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      pages.forEach(p => {
        if (p.dataset.page === target) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // trigger skill bars when opening resume
      if (target === 'resume') animateSkills();
    });
  });

  // sidebar show contacts
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  const sidebarMore = document.querySelector('.sidebar-info_more');
  sidebarBtn.addEventListener('click', () => {
    const expanded = sidebarBtn.getAttribute('aria-expanded') === 'true';
    sidebarBtn.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      sidebarMore.hidden = true;
      sidebarBtn.querySelector('.chev').style.transform = 'rotate(0deg)';
    } else {
      sidebarMore.hidden = false;
      sidebarBtn.querySelector('.chev').style.transform = 'rotate(180deg)';
    }
  });

  // skill animation
  function animateSkills() {
    const fills = document.querySelectorAll('.skill-progress-fill');
    fills.forEach(fill => {
      const width = fill.style.width || '0%';
      // animate to the width already set in style attribute
      fill.style.width = '0';
      setTimeout(() => fill.style.width = width, 30);
    });
  }

  // initial animate if resume active on load
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.dataset.page === 'resume') animateSkills();

  // simple project click example (pulse)
  document.querySelectorAll('[data-project="pulsemind"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      alert('PulseMind — MVP em desenvolvimento. Repositório: https://github.com/davilima1 (adicione mais infos no README).');
    });
  });
});

/* ----- Blog: renderização de posts (lista + post único) ----- */
(() => {
  const postsData = [
    {
      id: "post-001",
      title: "PulseMind: MVP, escolhas e primeiros passos",
      date: "2025-10-01",
      category: "tecnologia",
      tags: ["PulseMind","MVP","IA"],
      excerpt: "Relato direto do desenvolvimento do MVP do PulseMind: decisões técnicas, prioridades e o que eu vou testar primeiro.",
      content:
`O PulseMind nasceu da necessidade de transformar planejamento em hábito. Decidi começar pelo mínimo viável: sincronizar tarefas, sugerir prioridades e uma camada leve de IA para agrupar insights.\n\nArquitetura inicial: front-end responsivo, back-end serverless, banco leve (SQLite/Postgres) para começar. Testes: validação com 10 usuários beta. O mais importante? minimizar fricção.\n\nConclusão: escolha técnica limpa, validação rápida e feedback real — é assim que um projeto sobrevive às primeiras semanas.`
    },
    {
      id: "post-002",
      title: "Uma manhã de código e reflexões sobre aprender",
      date: "2025-09-12",
      category: "reflexoes",
      tags: ["aprendizado","rotina","dev"],
      excerpt: "Sobre hábitos, curiosidade e por que uma linha de código bem escrita vale mais que 100 tutoriais incompletos.",
      content:
`Aprender é exercício e paciência. Hoje escrevi uma função simples que refatorou horas de esforço anterior. Não foi mágica: foi disciplina.\n\nDica prática: escreva, teste, descreva. Documente o raciocínio por trás da implementação — daqui a três meses seu 'eu' vai agradecer.\n\nE lembre: o conhecimento vira ferramenta quando você usa pra construir algo que importe.`
    }
  ];

  // elementos
  const postsListEl = document.getElementById('posts-list');
  const postSingleEl = document.getElementById('post-single');
  const postContentEl = document.getElementById('post-content');
  const backBtn = document.getElementById('back-to-list');
  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');

  // cria card HTML
  function createCard(post){
    const li = document.createElement('div');
    li.className = 'blog-card';
    li.tabIndex = 0;
    li.dataset.id = post.id;
    li.innerHTML = `
      <div class="meta"><span class="cat">${post.category}</span><span>•</span><time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time></div>
      <h3 class="title">${post.title}</h3>
      <p class="excerpt">${post.excerpt}</p>
    `;
    // abrir no click
    li.addEventListener('click', () => openPost(post.id));
    li.addEventListener('keydown', (e) => { if(e.key === 'Enter') openPost(post.id) });
    return li;
  }

  // renderiza lista com filtro e busca
  function renderList(filter = 'all', query = ''){
    postsListEl.innerHTML = '';
    const q = query.trim().toLowerCase();
    const filtered = postsData.filter(p => {
      const byCat = (filter === 'all') || (p.category === filter);
      const byQuery = q === '' || [p.title,p.excerpt,p.content, (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
      return byCat && byQuery;
    });

    if(filtered.length === 0){
      postsListEl.innerHTML = `<p class="muted">Nenhum post encontrado.</p>`;
      return;
    }

    filtered.forEach(p => {
      postsListEl.appendChild(createCard(p));
    });
  }

  // abre post único
  function openPost(id){
    const post = postsData.find(p => p.id === id);
    if(!post) return;
    // esconde lista e mostra post-single
    postsListEl.style.display = 'none';
    postSingleEl.hidden = false;
    window.scrollTo({top: postSingleEl.offsetTop - 20, behavior:'smooth'});
    postContentEl.innerHTML = `
      <h1 class="post-title">${post.title}</h1>
      <div class="post-meta">${new Date(post.date).toLocaleDateString()} • ${post.category} • ${post.tags.join(', ')}</div>
      <div class="post-body">${escapeHtml(post.content).replace(/\n/g,'<br/><br/>')}</div>
    `;
  }

  // voltar
  backBtn.addEventListener('click', () => {
    postSingleEl.hidden = true;
    postsListEl.style.display = '';
  });

  // search and filter
  searchInput.addEventListener('input', () => renderList(filterSelect.value, searchInput.value));
  filterSelect.addEventListener('change', () => renderList(filterSelect.value, searchInput.value));

  // util
  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  // inicial
  renderList();
})();
