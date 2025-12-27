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
    
    const repoUrl = document.getElementById('githubRepo').value;
    const purpose = document.querySelector('input[name="purpose"]:checked').value;
    const customDescription = document.getElementById('customDescription').value;
    const sections = Array.from(document.querySelectorAll('input[name="sections"]:checked')).map(cb => cb.value);
    
    const { owner, repo } = extractRepoInfo(repoUrl);
    
    // Show loading state
    const submitBtn = document.querySelector('.generate-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;
    
    try {
        // Fetch repository data
        const repoData = await fetchRepoData(owner, repo);
        
        // Generate AI-powered README
        const readme = await generateSmartReadme(repoData, purpose, sections, customDescription);
        
        document.getElementById('readmeContent').value = readme;
        document.getElementById('output').style.display = 'block';
        
        // Scroll to output
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert('Error analyzing repository: ' + error.message);
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
        // Fallback for older browsers
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

function extractRepoInfo(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error('Invalid GitHub URL');
    const repo = match[2].replace(/\.git$/, '');
    return { owner: match[1], repo };
}

async function fetchRepoData(owner, repo) {
    const baseUrl = 'https://api.github.com';
    
    const [repoInfo, languages, contents] = await Promise.all([
        fetch(`${baseUrl}/repos/${owner}/${repo}`).then(r => r.json()),
        fetch(`${baseUrl}/repos/${owner}/${repo}/languages`).then(r => r.json()),
        fetch(`${baseUrl}/repos/${owner}/${repo}/contents`).then(r => r.json())
    ]);
    
    const keyFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml', 'composer.json'];
    const fileContents = {};
    
    for (const file of keyFiles) {
        const fileInfo = contents.find(f => f.name === file);
        if (fileInfo) {
            try {
                const content = await fetch(fileInfo.download_url).then(r => r.text());
                fileContents[file] = content;
            } catch (e) {}
        }
    }
    
    return { repoInfo, languages, contents, fileContents };
}

async function generateSmartReadme(repoData, purpose, sections, customDescription = '') {
    const { repoInfo, languages, contents, fileContents } = repoData;
    
    const customContext = purpose === 'custom' && customDescription ? 
        `\nCustom Requirements: ${customDescription}` : '';
    
    // Analyze actual repository structure
    const hasTests = contents.some(f => f.name.toLowerCase().includes('test') || f.name.toLowerCase().includes('spec'));
    const hasDocker = contents.some(f => f.name === 'Dockerfile');
    const hasCI = contents.some(f => f.name === '.github');
    const hasLicense = contents.some(f => f.name.toLowerCase().includes('license'));
    
    // Extract actual dependencies and analyze project type
    let actualDependencies = '';
    let projectType = 'application';
    let frameworksUsed = [];
    
    if (fileContents['package.json']) {
        const pkg = JSON.parse(fileContents['package.json']);
        const deps = Object.keys(pkg.dependencies || {});
        const devDeps = Object.keys(pkg.devDependencies || {});
        actualDependencies = `Dependencies: ${deps.join(', ')}\nDev Dependencies: ${devDeps.join(', ')}`;
        
        // Detect project type and frameworks
        if (deps.includes('react')) { projectType = 'React application'; frameworksUsed.push('React'); }
        if (deps.includes('express')) { projectType = 'Node.js server'; frameworksUsed.push('Express'); }
        if (deps.includes('next')) { projectType = 'Next.js application'; frameworksUsed.push('Next.js'); }
        if (deps.includes('vue')) { projectType = 'Vue.js application'; frameworksUsed.push('Vue.js'); }
        if (deps.includes('angular')) { projectType = 'Angular application'; frameworksUsed.push('Angular'); }
        if (deps.includes('redis')) frameworksUsed.push('Redis');
        if (deps.includes('mongodb') || deps.includes('mongoose')) frameworksUsed.push('MongoDB');
        if (deps.includes('mysql') || deps.includes('mysql2')) frameworksUsed.push('MySQL');
        if (deps.includes('bcrypt')) frameworksUsed.push('bcrypt for authentication');
        if (deps.includes('cors')) frameworksUsed.push('CORS support');
    }
    
    const prompt = `Generate a comprehensive, professional README.md ONLY using actual repository data. DO NOT invent features or functionality.

REPOSITORY ANALYSIS:
- Name: ${repoInfo.name}
- Description: ${repoInfo.description || 'No description provided'}
- Languages: ${Object.keys(languages).join(', ')} (percentages: ${JSON.stringify(languages)})
- Project Type: ${projectType}
- Frameworks/Libraries: ${frameworksUsed.join(', ') || 'None detected'}
- Stars: ${repoInfo.stargazers_count || 0}
- Forks: ${repoInfo.forks_count || 0}
- Files: ${contents.map(f => f.name).slice(0, 20).join(', ')}
- Has Tests: ${hasTests}
- Has Docker: ${hasDocker}
- Has CI/CD: ${hasCI}
- Has License: ${hasLicense}
${actualDependencies}${customContext}

STRICT REQUIREMENTS:
1. Base ALL content on actual repository data
2. Only mention features that exist in the codebase
3. Use actual dependencies for tech stack
4. Create realistic installation steps based on package managers found
5. NO EMOJIS unless custom requirements specifically request them
6. Make it ${purpose}-focused but accurate

Generate sections:
- Clean title
- Compelling description based on actual repo purpose
- Features (inferred from actual files/dependencies)
- Tech stack (actual languages/frameworks only)
- Installation guide (based on actual package files)
- Usage instructions (realistic for the project type)
- Contributing guidelines
- License section (only if license file exists)

Make it professional, accurate, and engaging for ${purpose} context. Return ONLY markdown.`;

    const apiKey = window.CONFIG?.GEMINI_API_KEY || 'AIzaSyBbYFA32beNtkVIkbVWRe3tAbNiVfr1TAI';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
