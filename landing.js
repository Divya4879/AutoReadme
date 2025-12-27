// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Load generator functionality immediately if on generator page
if (document.getElementById('readmeForm')) {
    loadGeneratorScript();
}

// Load generator app when section is visible (for landing page)
const generatorSection = document.querySelector('#generator');
let generatorLoaded = false;

if (generatorSection) {
    const generatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !generatorLoaded) {
                loadGeneratorApp();
                generatorLoaded = true;
            }
        });
    }, { threshold: 0.1 });

    generatorObserver.observe(generatorSection);
}

function loadGeneratorApp() {
    const generatorApp = document.getElementById('generator-app');
    
    // Load the generator form HTML
    generatorApp.innerHTML = `
        <div class="generator-form">
            <form id="readmeForm" class="form-container">
                <div class="form-section">
                    <h3><i class="fab fa-github"></i> Repository Details</h3>
                    <div class="input-group">
                        <label for="githubRepo">GitHub Repository URL</label>
                        <input type="url" id="githubRepo" placeholder="https://github.com/username/repository" required>
                        <span class="input-hint">We'll analyze your repository structure and dependencies</span>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-bullseye"></i> Project Purpose</h3>
                    <div class="purpose-grid">
                        <label class="purpose-card">
                            <input type="radio" name="purpose" value="saas" required>
                            <div class="card-content">
                                <i class="fas fa-rocket"></i>
                                <h4>SaaS Product</h4>
                                <p>Commercial application focused on scalability</p>
                            </div>
                        </label>
                        <label class="purpose-card">
                            <input type="radio" name="purpose" value="hackathon" required>
                            <div class="card-content">
                                <i class="fas fa-lightbulb"></i>
                                <h4>Hackathon</h4>
                                <p>Innovative project showcasing creativity</p>
                            </div>
                        </label>
                        <label class="purpose-card">
                            <input type="radio" name="purpose" value="freelance" required>
                            <div class="card-content">
                                <i class="fas fa-briefcase"></i>
                                <h4>Client Project</h4>
                                <p>Professional solution for clients</p>
                            </div>
                        </label>
                        <label class="purpose-card">
                            <input type="radio" name="purpose" value="custom" required>
                            <div class="card-content">
                                <i class="fas fa-cog"></i>
                                <h4>Custom</h4>
                                <p>Specialized application</p>
                            </div>
                        </label>
                    </div>
                    
                    <div id="customInput" class="custom-input" style="display: none;">
                        <label for="customDescription">Describe your project's purpose and focus</label>
                        <textarea id="customDescription" placeholder="Describe your project's main purpose, target audience, key problems it solves..."></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-list-check"></i> README Sections</h3>
                    <div class="sections-grid">
                        <label class="section-item">
                            <input type="checkbox" name="sections" value="features" checked>
                            <span class="checkmark"></span>
                            <div class="section-info">
                                <i class="fas fa-star"></i>
                                <span>Key Features</span>
                            </div>
                        </label>
                        <label class="section-item">
                            <input type="checkbox" name="sections" value="tech" checked>
                            <span class="checkmark"></span>
                            <div class="section-info">
                                <i class="fas fa-code"></i>
                                <span>Tech Stack</span>
                            </div>
                        </label>
                        <label class="section-item">
                            <input type="checkbox" name="sections" value="architecture">
                            <span class="checkmark"></span>
                            <div class="section-info">
                                <i class="fas fa-sitemap"></i>
                                <span>Architecture</span>
                            </div>
                        </label>
                        <label class="section-item">
                            <input type="checkbox" name="sections" value="contributing" checked>
                            <span class="checkmark"></span>
                            <div class="section-info">
                                <i class="fas fa-users"></i>
                                <span>Contributing</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button type="submit" class="generate-btn">
                    <i class="fas fa-magic"></i>
                    <span>Generate Professional README</span>
                    <div class="btn-loader" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </button>
            </form>

            <div id="output" class="output-section" style="display: none;">
                <div class="output-header">
                    <h3><i class="fas fa-file-alt"></i> Generated README.md</h3>
                    <div class="output-actions">
                        <button id="copyBtn" class="action-btn">
                            <i class="fas fa-copy"></i>
                            Copy
                        </button>
                        <button id="downloadBtn" class="action-btn primary">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    </div>
                </div>
                <div class="editor-container">
                    <textarea id="readmeContent" readonly></textarea>
                </div>
            </div>
        </div>
    `;
    
    // Add generator styles
    const generatorStyles = document.createElement('style');
    generatorStyles.textContent = `
        .generator-form {
            background: var(--bg-card);
            border-radius: var(--radius);
            border: 1px solid var(--border);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
        }
        
        .form-container {
            padding: 2.5rem;
        }
        
        .form-section {
            margin-bottom: 2.5rem;
        }
        
        .form-section h3 {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
        }
        
        .form-section h3 i {
            color: var(--accent-primary);
        }
        
        .input-group label {
            display: block;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .input-group input, .custom-input textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--border);
            border-radius: var(--radius-sm);
            font-size: 1rem;
            background: var(--bg-secondary);
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        
        .input-group input:focus, .custom-input textarea:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }
        
        .input-hint {
            display: block;
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }
        
        .purpose-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .purpose-card {
            position: relative;
            cursor: pointer;
            border-radius: var(--radius-sm);
            border: 2px solid var(--border);
            background: var(--bg-secondary);
            transition: all 0.3s ease;
        }
        
        .purpose-card:hover {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        
        .purpose-card input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }
        
        .purpose-card input:checked + .card-content {
            border-color: var(--accent-primary);
            background: rgba(0, 212, 255, 0.1);
        }
        
        .card-content {
            padding: 1.5rem;
            text-align: center;
            border-radius: var(--radius-sm);
        }
        
        .card-content i {
            font-size: 1.5rem;
            color: var(--accent-primary);
            margin-bottom: 0.75rem;
        }
        
        .card-content h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .card-content p {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .custom-input {
            margin-top: 1rem;
        }
        
        .custom-input label {
            display: block;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .custom-input textarea {
            min-height: 100px;
            resize: vertical;
            font-family: inherit;
        }
        
        .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }
        
        .section-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            border: 2px solid var(--border);
            border-radius: var(--radius-sm);
            background: var(--bg-secondary);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .section-item:hover {
            border-color: var(--accent-primary);
            background: rgba(0, 212, 255, 0.05);
        }
        
        .section-item input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }
        
        .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border);
            border-radius: 4px;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .section-item input:checked + .checkmark {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
        }
        
        .section-item input:checked + .checkmark::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--bg-primary);
            font-size: 12px;
            font-weight: bold;
        }
        
        .section-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section-info i {
            color: var(--accent-primary);
        }
        
        .generate-btn {
            width: 100%;
            padding: 1.25rem 2rem;
            background: var(--accent-gradient);
            color: var(--text-primary);
            border: none;
            border-radius: var(--radius-sm);
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            position: relative;
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }
        
        .generate-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-loader {
            position: absolute;
        }
        
        .output-section {
            border-top: 1px solid var(--border);
            background: var(--bg-secondary);
        }
        
        .output-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2.5rem;
            border-bottom: 1px solid var(--border);
        }
        
        .output-header h3 {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .output-actions {
            display: flex;
            gap: 0.75rem;
        }
        
        .action-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--border);
            background: var(--bg-card);
            color: var(--text-primary);
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .action-btn:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }
        
        .action-btn.primary {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
            color: var(--bg-primary);
        }
        
        .action-btn.primary:hover {
            background: var(--accent-secondary);
            border-color: var(--accent-secondary);
        }
        
        .editor-container {
            padding: 2.5rem;
        }
        
        #readmeContent {
            width: 100%;
            min-height: 400px;
            padding: 1.5rem;
            border: 2px solid var(--border);
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            line-height: 1.6;
            background: var(--bg-primary);
            color: var(--text-primary);
            resize: vertical;
        }
        
        #readmeContent:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }
    `;
    document.head.appendChild(generatorStyles);
    
    // Load the generator script functionality
    loadGeneratorScript();
}

function loadGeneratorScript() {
    // Handle file upload
    document.getElementById('projectUpload').addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const uploadedFiles = document.getElementById('uploadedFiles');
        
        if (files.length > 0) {
            uploadedFiles.style.display = 'block';
            uploadedFiles.innerHTML = `
                <div class="file-summary">
                    <i class="fas fa-folder"></i>
                    <span>${files.length} files uploaded from "${files[0].webkitRelativePath.split('/')[0]}"</span>
                </div>
                ${files.slice(0, 10).map(file => `
                    <div class="file-item">
                        <i class="fas fa-file"></i>
                        <span>${file.webkitRelativePath}</span>
                    </div>
                `).join('')}
                ${files.length > 10 ? `<div class="file-item"><i class="fas fa-ellipsis-h"></i><span>... and ${files.length - 10} more files</span></div>` : ''}
            `;
        }
    });

    // Show/hide custom input based on purpose selection
    document.querySelectorAll('input[name="purpose"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const customInput = document.getElementById('customInput');
            if (this.value === 'custom') {
                customInput.style.display = 'block';
            } else {
                customInput.style.display = 'none';
            }
        });
    });

    document.getElementById('readmeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const purpose = document.querySelector('input[name="purpose"]:checked').value;
        const customDescription = document.getElementById('customDescription').value;
        const sections = Array.from(document.querySelectorAll('input[name="sections"]:checked')).map(cb => cb.value);
        const files = document.getElementById('projectUpload').files;
        
        if (!files || files.length === 0) {
            alert('Please upload your project folder first.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.generate-btn');
        const btnText = submitBtn.querySelector('span');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            // Process uploaded files
            const repoData = await processUploadedFiles(files);
            
            // Generate AI-powered README
            const readme = await generateSmartReadme(repoData, purpose, sections, customDescription);
            
            document.getElementById('readmeContent').value = readme;
            document.getElementById('output').style.display = 'block';
            
            // Scroll to output
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            alert('Error analyzing project: ' + error.message);
        } finally {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Copy functionality
    document.getElementById('copyBtn').addEventListener('click', async function() {
        const content = document.getElementById('readmeContent').value;
        try {
            await navigator.clipboard.writeText(content);
            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            document.getElementById('readmeContent').select();
            document.execCommand('copy');
        }
    });

    // Download functionality
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const content = document.getElementById('readmeContent').value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function extractRepoInfo(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error('Invalid GitHub URL');
    const repo = match[2].replace(/\.git$/, '');
    return { owner: match[1], repo };
}

async function processUploadedFiles(files) {
    const fileArray = Array.from(files);
    const fileContents = {};
    const codeFiles = [];
    const directories = new Set();
    const allFiles = [];
    
    // Extract complete directory structure
    fileArray.forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const pathParts = path.split('/');
        
        // Add all directory levels
        for (let i = 1; i < pathParts.length; i++) {
            directories.add(pathParts.slice(0, i).join('/'));
        }
        
        allFiles.push({
            name: file.name,
            path: path,
            size: file.size,
            type: file.type
        });
    });
    
    // Read ALL configuration and important files
    const keyFiles = [
        'package.json', 'package-lock.json', 'yarn.lock', 'requirements.txt', 'Pipfile', 'poetry.lock',
        'Cargo.toml', 'Cargo.lock', 'go.mod', 'go.sum', 'pom.xml', 'build.gradle', 'composer.json',
        'Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', '.dockerignore',
        '.env', '.env.example', '.env.local', '.env.production', '.env.development',
        'config.js', 'config.py', 'settings.py', 'config.json', 'tsconfig.json', 'webpack.config.js',
        'README.md', 'readme.md', 'README.txt', 'CHANGELOG.md', 'LICENSE', 'license.txt',
        '.gitignore', '.gitattributes', 'makefile', 'Makefile', 'CMakeLists.txt',
        'index.js', 'index.ts', 'main.py', 'app.py', 'server.js', 'app.js', 'index.html', 'main.html'
    ];
    
    // Read ALL source code files (no limits for professional analysis)
    const sourceExtensions = [
        '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
        '.py', '.pyx', '.pyi', '.ipynb',
        '.java', '.kt', '.scala', '.groovy',
        '.cpp', '.cc', '.cxx', '.c', '.h', '.hpp',
        '.rs', '.go', '.php', '.rb', '.swift', '.cs', '.fs',
        '.html', '.htm', '.css', '.scss', '.sass', '.less',
        '.sql', '.graphql', '.gql', '.proto', '.yaml', '.yml', '.toml', '.ini'
    ];
    
    // Process ALL files comprehensively
    for (const file of fileArray) {
        const fileName = file.name;
        const filePath = file.webkitRelativePath || file.name;
        const fileExt = '.' + fileName.split('.').pop();
        
        try {
            // Read ALL key configuration files completely
            if (keyFiles.some(key => fileName === key || filePath.endsWith('/' + key) || fileName.toLowerCase() === key.toLowerCase())) {
                const content = await file.text();
                fileContents[filePath] = content;
            }
            
            // Read ALL source code files completely
            else if (sourceExtensions.includes(fileExt.toLowerCase())) {
                const content = await file.text();
                codeFiles.push({
                    name: fileName,
                    path: filePath,
                    content: content, // Full content for professional analysis
                    size: file.size,
                    extension: fileExt,
                    patterns: analyzeCodePatterns(content, fileExt),
                    imports: extractImports(content, fileExt),
                    functions: extractFunctions(content, fileExt),
                    classes: extractClasses(content, fileExt),
                    apis: extractAPIEndpoints(content, fileExt),
                    database: extractDatabaseQueries(content, fileExt)
                });
            }
        } catch (e) {
            console.warn(`Could not read file ${filePath}:`, e);
        }
    }
    
    // Comprehensive language analysis
    const languages = {};
    const frameworks = new Set();
    const databases = new Set();
    const tools = new Set();
    
    fileArray.forEach(file => {
        const ext = '.' + file.name.split('.').pop();
        const langMap = {
            '.js': 'JavaScript', '.jsx': 'JavaScript', '.ts': 'TypeScript', '.tsx': 'TypeScript',
            '.vue': 'Vue.js', '.svelte': 'Svelte',
            '.py': 'Python', '.pyx': 'Python', '.pyi': 'Python', '.ipynb': 'Jupyter Notebook',
            '.java': 'Java', '.kt': 'Kotlin', '.scala': 'Scala', '.groovy': 'Groovy',
            '.cpp': 'C++', '.cc': 'C++', '.cxx': 'C++', '.c': 'C', '.h': 'C/C++', '.hpp': 'C++',
            '.rs': 'Rust', '.go': 'Go', '.php': 'PHP', '.rb': 'Ruby', '.swift': 'Swift',
            '.cs': 'C#', '.fs': 'F#', '.html': 'HTML', '.css': 'CSS', '.scss': 'SCSS',
            '.sql': 'SQL', '.graphql': 'GraphQL', '.yaml': 'YAML', '.yml': 'YAML'
        };
        
        if (langMap[ext.toLowerCase()]) {
            const lang = langMap[ext.toLowerCase()];
            languages[lang] = (languages[lang] || 0) + file.size;
        }
    });
    
    // Analyze package.json for comprehensive framework detection
    if (fileContents['package.json']) {
        try {
            const pkg = JSON.parse(fileContents['package.json']);
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
            
            Object.keys(allDeps).forEach(dep => {
                // Frontend frameworks
                if (['react', 'vue', 'angular', 'svelte', 'solid-js'].includes(dep)) frameworks.add(dep);
                // Backend frameworks
                if (['express', 'fastify', 'koa', 'hapi', 'nestjs', 'next'].includes(dep)) frameworks.add(dep);
                // Databases
                if (['mongodb', 'mongoose', 'mysql', 'mysql2', 'pg', 'postgres', 'redis', 'sqlite3'].includes(dep)) databases.add(dep);
                // Tools
                if (['webpack', 'vite', 'rollup', 'parcel', 'babel', 'typescript', 'eslint', 'prettier'].includes(dep)) tools.add(dep);
            });
        } catch (e) {}
    }
    
    // Create comprehensive repo info
    const projectName = fileArray[0]?.webkitRelativePath?.split('/')[0] || 'uploaded-project';
    const repoInfo = {
        name: toTitleCase(projectName), // Convert to proper title case
        description: 'Professional project uploaded for comprehensive README generation',
        stargazers_count: 0,
        forks_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        totalFiles: fileArray.length,
        totalSize: fileArray.reduce((sum, f) => sum + f.size, 0)
    };
    
    return {
        repoInfo,
        languages,
        frameworks: Array.from(frameworks),
        databases: Array.from(databases),
        tools: Array.from(tools),
        contents: allFiles,
        fileContents,
        codeFiles,
        directories: Array.from(directories),
        projectStructure: analyzeProjectStructure(Array.from(directories), allFiles),
        architecturePatterns: detectArchitecturePatterns(codeFiles, Array.from(directories))
    };
}

// Enhanced pattern analysis functions
function analyzeCodePatterns(content, extension) {
    const patterns = [];
    const lowerContent = content.toLowerCase();
    
    // API patterns
    if (lowerContent.includes('app.get') || lowerContent.includes('app.post') || lowerContent.includes('router.')) {
        patterns.push('REST API endpoints');
    }
    if (lowerContent.includes('graphql') || lowerContent.includes('apollo')) {
        patterns.push('GraphQL API');
    }
    if (lowerContent.includes('websocket') || lowerContent.includes('socket.io')) {
        patterns.push('WebSocket communication');
    }
    
    // Database patterns
    if (lowerContent.includes('mongoose.') || lowerContent.includes('mongodb')) {
        patterns.push('MongoDB operations');
    }
    if (lowerContent.includes('sequelize') || lowerContent.includes('prisma')) {
        patterns.push('ORM usage');
    }
    
    // Authentication patterns
    if (lowerContent.includes('bcrypt') || lowerContent.includes('password')) {
        patterns.push('Password hashing');
    }
    if (lowerContent.includes('jwt') || lowerContent.includes('jsonwebtoken')) {
        patterns.push('JWT authentication');
    }
    
    // Frontend patterns
    if (lowerContent.includes('usestate') || lowerContent.includes('useeffect')) {
        patterns.push('React hooks');
    }
    if (lowerContent.includes('component') && extension.includes('vue')) {
        patterns.push('Vue components');
    }
    
    return patterns;
}

function extractImports(content, extension) {
    const imports = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ') || 
            trimmed.startsWith('require(') || trimmed.startsWith('const ') && trimmed.includes('require(')) {
            imports.push(trimmed);
        }
    });
    
    return imports.slice(0, 20); // Top 20 imports
}

function extractFunctions(content, extension) {
    const functions = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('function ') || trimmed.includes('def ') || 
            trimmed.includes('const ') && trimmed.includes('=>') ||
            trimmed.includes('async ')) {
            functions.push(trimmed);
        }
    });
    
    return functions.slice(0, 15); // Top 15 functions
}

function extractClasses(content, extension) {
    const classes = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('class ') || trimmed.startsWith('interface ') ||
            trimmed.startsWith('type ')) {
            classes.push(trimmed);
        }
    });
    
    return classes.slice(0, 10); // Top 10 classes
}

function extractAPIEndpoints(content, extension) {
    const endpoints = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('app.get') || trimmed.includes('app.post') || 
            trimmed.includes('app.put') || trimmed.includes('app.delete') ||
            trimmed.includes('router.')) {
            endpoints.push(trimmed);
        }
    });
    
    return endpoints;
}

function extractDatabaseQueries(content, extension) {
    const queries = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('SELECT ') || trimmed.includes('INSERT ') || 
            trimmed.includes('UPDATE ') || trimmed.includes('DELETE ') ||
            trimmed.includes('.find(') || trimmed.includes('.create(') ||
            trimmed.includes('.save(') || trimmed.includes('.update(')) {
            queries.push(trimmed);
        }
    });
    
    return queries.slice(0, 10); // Top 10 queries
}

function analyzeProjectStructure(directories, files) {
    const structure = {
        hasSourceDir: directories.some(d => d.includes('src')),
        hasPublicDir: directories.some(d => d.includes('public')),
        hasTestDir: directories.some(d => d.includes('test') || d.includes('spec')),
        hasDocsDir: directories.some(d => d.includes('docs') || d.includes('documentation')),
        hasConfigDir: directories.some(d => d.includes('config') || d.includes('settings')),
        hasAssetsDir: directories.some(d => d.includes('assets') || d.includes('static')),
        hasComponentsDir: directories.some(d => d.includes('components')),
        hasModelsDir: directories.some(d => d.includes('models')),
        hasControllersDir: directories.some(d => d.includes('controllers')),
        hasRoutesDir: directories.some(d => d.includes('routes') || d.includes('api')),
        hasMiddlewareDir: directories.some(d => d.includes('middleware')),
        hasUtilsDir: directories.some(d => d.includes('utils') || d.includes('helpers')),
        totalDirectories: directories.length,
        maxDepth: Math.max(...directories.map(d => d.split('/').length))
    };
    
    return structure;
}

function detectArchitecturePatterns(codeFiles, directories) {
    const patterns = [];
    
    // MVC pattern
    if (directories.some(d => d.includes('models')) && 
        directories.some(d => d.includes('views')) && 
        directories.some(d => d.includes('controllers'))) {
        patterns.push('MVC Architecture');
    }
    
    // Microservices
    if (directories.filter(d => d.includes('service')).length > 1) {
        patterns.push('Microservices Architecture');
    }
    
    // Component-based
    if (directories.some(d => d.includes('components'))) {
        patterns.push('Component-based Architecture');
    }
    
    // Layered architecture
    if (directories.some(d => d.includes('controllers')) && 
        directories.some(d => d.includes('services')) && 
        directories.some(d => d.includes('repositories'))) {
        patterns.push('Layered Architecture');
    }
    
    return patterns;
}

// Convert repo name to proper title case
function toTitleCase(str) {
    return str
        .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters (camelCase)
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

async function fetchRepoData(owner, repo) {
    const baseUrl = 'https://api.github.com';
    
    const [repoInfo, languages, contents] = await Promise.all([
        fetch(`${baseUrl}/repos/${owner}/${repo}`).then(r => r.json()),
        fetch(`${baseUrl}/repos/${owner}/${repo}/languages`).then(r => r.json()),
        fetch(`${baseUrl}/repos/${owner}/${repo}/contents`).then(r => r.json())
    ]);
    
    // Read all important files for comprehensive analysis
    const keyFiles = [
        'package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml', 'composer.json',
        'Dockerfile', 'docker-compose.yml', '.env.example', 'config.js', 'config.py',
        'README.md', 'index.js', 'main.py', 'app.py', 'server.js', 'index.html',
        'src/App.js', 'src/main.js', 'src/index.js', 'public/index.html'
    ];
    
    const fileContents = {};
    const codeFiles = [];
    
    // Read key configuration and entry files
    for (const file of keyFiles) {
        const fileInfo = contents.find(f => f.name === file);
        if (fileInfo) {
            try {
                const content = await fetch(fileInfo.download_url).then(r => r.text());
                fileContents[file] = content;
            } catch (e) {}
        }
    }
    
    // Read source code files for deeper analysis
    const sourceFiles = contents.filter(f => 
        f.type === 'file' && 
        (f.name.endsWith('.js') || f.name.endsWith('.py') || f.name.endsWith('.java') || 
         f.name.endsWith('.cpp') || f.name.endsWith('.rs') || f.name.endsWith('.go') ||
         f.name.endsWith('.php') || f.name.endsWith('.rb') || f.name.endsWith('.cs') ||
         f.name.endsWith('.jsx') || f.name.endsWith('.ts') || f.name.endsWith('.tsx'))
    ).slice(0, 10); // Limit to first 10 source files
    
    for (const file of sourceFiles) {
        try {
            const content = await fetch(file.download_url).then(r => r.text());
            codeFiles.push({
                name: file.name,
                content: content.slice(0, 2000), // First 2000 chars for analysis
                size: file.size
            });
        } catch (e) {}
    }
    
    // Analyze directory structure
    const directories = contents.filter(f => f.type === 'dir').map(d => d.name);
    
    return { repoInfo, languages, contents, fileContents, codeFiles, directories };
}

async function generateSmartReadme(repoData, purpose, sections, customDescription = '') {
    const { repoInfo, languages, contents, fileContents, codeFiles, directories } = repoData;
    
    const customContext = purpose === 'custom' && customDescription ? 
        `\nCustom Requirements: ${customDescription}` : '';
    
    // Deep analysis of repository structure
    const hasTests = contents.some(f => f.name.toLowerCase().includes('test') || f.name.toLowerCase().includes('spec')) ||
                     directories.some(d => d.toLowerCase().includes('test'));
    const hasDocker = contents.some(f => f.name === 'Dockerfile' || f.name === 'docker-compose.yml');
    const hasCI = contents.some(f => f.name === '.github') || directories.includes('.github');
    const hasLicense = contents.some(f => f.name.toLowerCase().includes('license'));
    const hasEnv = contents.some(f => f.name.includes('.env'));
    
    // Analyze code patterns and architecture
    let architecturePatterns = [];
    let apiEndpoints = [];
    let databaseUsage = [];
    let frameworksUsed = [];
    let actualFeatures = [];
    
    // Analyze package.json for detailed insights
    if (fileContents['package.json']) {
        const pkg = JSON.parse(fileContents['package.json']);
        const deps = Object.keys(pkg.dependencies || {});
        const devDeps = Object.keys(pkg.devDependencies || {});
        
        // Framework detection
        if (deps.includes('react')) frameworksUsed.push('React');
        if (deps.includes('express')) frameworksUsed.push('Express.js');
        if (deps.includes('next')) frameworksUsed.push('Next.js');
        if (deps.includes('vue')) frameworksUsed.push('Vue.js');
        if (deps.includes('angular')) frameworksUsed.push('Angular');
        if (deps.includes('fastify')) frameworksUsed.push('Fastify');
        
        // Database detection
        if (deps.includes('mongodb') || deps.includes('mongoose')) databaseUsage.push('MongoDB');
        if (deps.includes('mysql') || deps.includes('mysql2')) databaseUsage.push('MySQL');
        if (deps.includes('pg') || deps.includes('postgres')) databaseUsage.push('PostgreSQL');
        if (deps.includes('redis')) databaseUsage.push('Redis');
        if (deps.includes('sqlite3')) databaseUsage.push('SQLite');
        
        // Feature detection
        if (deps.includes('bcrypt')) actualFeatures.push('User authentication with password hashing');
        if (deps.includes('jsonwebtoken')) actualFeatures.push('JWT-based authentication');
        if (deps.includes('cors')) actualFeatures.push('Cross-origin resource sharing');
        if (deps.includes('multer')) actualFeatures.push('File upload handling');
        if (deps.includes('socket.io')) actualFeatures.push('Real-time communication');
        if (deps.includes('nodemailer')) actualFeatures.push('Email functionality');
        if (deps.includes('stripe')) actualFeatures.push('Payment processing');
    }
    
    // Analyze source code for patterns
    codeFiles.forEach(file => {
        const content = file.content.toLowerCase();
        
        // API endpoint detection
        if (content.includes('app.get') || content.includes('app.post') || content.includes('router.')) {
            architecturePatterns.push('RESTful API architecture');
        }
        if (content.includes('graphql') || content.includes('apollo')) {
            architecturePatterns.push('GraphQL API');
        }
        if (content.includes('websocket') || content.includes('socket.io')) {
            actualFeatures.push('Real-time WebSocket communication');
        }
        if (content.includes('middleware')) {
            architecturePatterns.push('Middleware-based request processing');
        }
        if (content.includes('async') && content.includes('await')) {
            architecturePatterns.push('Asynchronous programming patterns');
        }
    });
    
    // Directory structure analysis
    if (directories.includes('src')) architecturePatterns.push('Source code organization');
    if (directories.includes('components')) architecturePatterns.push('Component-based architecture');
    if (directories.includes('models')) architecturePatterns.push('MVC architecture pattern');
    if (directories.includes('controllers')) architecturePatterns.push('Controller-based routing');
    if (directories.includes('middleware')) architecturePatterns.push('Custom middleware implementation');
    if (directories.includes('utils') || directories.includes('helpers')) architecturePatterns.push('Utility functions and helpers');
    
    const purposeContext = {
        personal: "personal/hobby project for learning and portfolio building",
        hackathon: "hackathon project showcasing innovation and rapid development skills",
        academic: "academic project demonstrating technical knowledge and research capabilities",
        freelance: "professional client project emphasizing quality and business requirements",
        saas: "commercial SaaS product focused on scalability and business value",
        opensource: "open-source project encouraging community collaboration and contributions",
        startup: "startup MVP demonstrating product-market fit and growth potential",
        custom: "specialized project with unique requirements"
    };
    
    const prompt = `Generate a comprehensive, professional README.md for this ${purposeContext[purpose]}. Use ONLY actual repository analysis data.

DEEP REPOSITORY ANALYSIS:
- Name: ${repoInfo.name}
- Description: ${repoInfo.description || 'No description provided'}
- Languages: ${Object.keys(languages).join(', ')} (percentages: ${JSON.stringify(languages)})
- Frameworks: ${frameworksUsed.join(', ') || 'None detected'}
- Databases: ${databaseUsage.join(', ') || 'None detected'}
- Architecture Patterns: ${architecturePatterns.join(', ') || 'Standard structure'}
- Detected Features: ${actualFeatures.join(', ') || 'Basic functionality'}
- Directory Structure: ${directories.join(', ')}
- Code Files Analyzed: ${codeFiles.map(f => f.name).join(', ')}
- Project Structure: ${JSON.stringify(repoData.projectStructure)}
- Has Tests: ${hasTests}
- Has Docker: ${hasDocker}
- Has CI/CD: ${hasCI}
- Has Environment Config: ${hasEnv}
- Has License: ${hasLicense}
- Stars: ${repoInfo.stargazers_count || 0}
- Forks: ${repoInfo.forks_count || 0}
${customContext}

SECTIONS TO INCLUDE: ${sections.join(', ')}

STRICT MARKDOWN FORMATTING REQUIREMENTS:
1. Use proper code blocks with language specification: \`\`\`bash, \`\`\`python, \`\`\`javascript, etc.
2. Use --- as section separators between all major sections
3. Create ASCII directory trees for project structure using this format:
   \`\`\`
   project-name/
   ├── file1.ext
   ├── folder1/
   │   ├── subfolder/
   │   │   └── file.ext
   │   └── file2.ext
   └── folder2/
       └── file3.ext
   \`\`\`
4. All installation commands must be in proper code blocks with language tags
5. All configuration examples must be in code blocks
6. Use proper markdown headers (##, ###) for subsections

ANALYSIS-BASED REQUIREMENTS:
1. Use ONLY features and patterns detected from actual code analysis
2. Base architecture description on actual directory structure and code patterns
3. Include actual frameworks, databases, and libraries found
4. Create realistic installation steps based on detected package managers
5. Generate usage examples based on detected API patterns and features
6. Include performance notes if relevant patterns detected
7. Add security considerations if authentication/authorization detected
8. Include deployment instructions based on detected containerization
9. Create troubleshooting section based on common issues for detected stack
10. Make it production-ready with proper badges and formatting

PURPOSE-SPECIFIC FOCUS:
- Personal/Hobby: Emphasize learning journey, skills demonstrated, portfolio value
- Hackathon: Highlight innovation, problem-solving, rapid development, competition context
- Academic: Focus on educational value, research methodology, technical concepts
- Client Work: Professional delivery, business requirements, maintainability
- SaaS: Business value, scalability, user benefits, market positioning
- Open Source: Community collaboration, contribution guidelines, project governance
- Startup MVP: Product vision, market opportunity, growth potential, user validation

Generate a complete, production-ready README with proper markdown formatting, code blocks with language tags, ASCII directory trees, and --- section separators. Make it comprehensive enough to need only 5-10 minutes of customization. Return ONLY markdown content.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBbYFA32beNtkVIkbVWRe3tAbNiVfr1TAI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
