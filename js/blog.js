// src/js/blog.js
let articles = [];
let marked;

// Load marked dynamically from CDN
async function ensureMarked() {
	if (marked) return marked;
	
	try {
		// Load from CDN as ESM module
		const markedModule = await import('https://cdn.jsdelivr.net/npm/marked@11/+esm');
		marked = markedModule.marked;
		console.log('Marked library loaded successfully');
	} catch (error) {
		console.error('Failed to load marked library:', error);
		throw error;
	}
	
	return marked;
}

export async function loadBlogArticles() {
	try {
		const response = await fetch('/blog.jsonl');
		const text = await response.text();
		articles = text.trim().split('\n').map(line => JSON.parse(line));

		renderBlogGrid();
	} catch (error) {
		console.error('Error loading blog articles:', error);
		document.getElementById('blog-grid').innerHTML = '<p>Error loading articles.</p>';
	}
}

function renderBlogGrid() {
	const grid = document.getElementById('blog-grid');
	grid.innerHTML = articles.map(article => `
		<div class="blog-card" data-article-id="${article.id}">
			<div class="blog-card-image">
				<img src="${article.coverImage}" alt="${article.title}" loading="lazy">
				<div class="blog-card-overlay">
					<div class="article-date">${new Date(article.date).toLocaleDateString()}</div>
				</div>
			</div>
			<div class="blog-card-content">
				<h3>${article.title}</h3>
				<p class="article-author">By ${article.author}</p>
				<p class="article-excerpt">${article.abstract}</p>
				<div class="article-tags">
					${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
				</div>
				<button class="read-more-btn" data-article-id="${article.id}">Read More →</button>
			</div>
		</div>
	`).join('');

	// Add event listeners
	document.querySelectorAll('.read-more-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const articleId = e.target.dataset.articleId;
			loadArticle(articleId);
		});
	});
}

async function loadArticle(articleId) {
	try {
		const article = articles.find(a => a.id === articleId);
		if (!article) return;

		// Ensure marked is loaded
		await ensureMarked();

		const response = await fetch(article.markdownContentFile);
		const markdown = await response.text();
		const html = marked(markdown);

		document.getElementById('article-content').innerHTML = `
			<article class="full-article">
				<header class="article-header">
					<h1>${article.title}</h1>
					<div class="article-meta">
						<span class="author">By ${article.author}</span>
						<span class="date">${new Date(article.date).toLocaleDateString()}</span>
					</div>
					<div class="article-tags">
						${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
					</div>
				</header>
				<div class="article-body">
					${html}
				</div>
			</article>
		`;

		document.getElementById('blog-grid').parentElement.style.display = 'none';
		document.getElementById('article-view').style.display = 'block';
	} catch (error) {
		console.error('Error loading article:', error);
	}
}

// Back button functionality
export function setupBackButton() {
	document.getElementById('back-to-blog').addEventListener('click', () => {
		document.getElementById('article-view').style.display = 'none';
		document.getElementById('blog-grid').parentElement.style.display = 'block';
	});
}