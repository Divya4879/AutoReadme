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
    
    const projectFiles = document.getElementById('projectUpload').files;
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value;
    const customDescription = document.getElementById('customDescription').value;
    const sections = Array.from(document.querySelectorAll('input[name="sections"]:checked')).map(cb => cb.value);
    
    console.log('Form submitted with:', { 
        filesCount: projectFiles.length, 
        purpose, 
        sectionsCount: sections.length 
    });
    
    if (!projectFiles.length) {
        alert('Please select a project folder');
        return;
    }
    
    if (!purpose) {
        alert('Please select a project purpose');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.generate-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;
    
    try {
        // Process uploaded files
        const projectData = await processUploadedFiles(projectFiles);
        
        // Generate AI-powered README
        const readme = await generateSmartReadme(projectData, purpose, sections, customDescription);
        
        const readmeContent = document.getElementById('readmeContent');
        const output = document.getElementById('output');
        
        if (readmeContent) readmeContent.value = readme;
        if (output) {
            output.style.display = 'block';
            output.scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        alert('Error processing project: ' + error.message);
    } finally {
        if (btnText) btnText.style.display = 'block';
        if (btnLoader) btnLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
});

// File upload feedback
document.getElementById('projectUpload').addEventListener('change', function(e) {
    const files = e.target.files;
    const uploadArea = document.querySelector('.upload-placeholder');
    
    if (files.length > 0) {
        const projectName = files[0].webkitRelativePath ? files[0].webkitRelativePath.split('/')[0] : 'Selected files';
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: green; font-size: 2em;"></i>
            <p><strong>${files.length} files selected</strong></p>
            <p>Project: ${projectName}</p>
            <small>Click to change selection</small>
        `;
    } else {
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p><strong>Click to select project folder</strong></p>
            <p>Choose a folder containing your project files</p>
            <small>Note: You need to select a folder, not individual files</small>
        `;
    }
});

// Make upload area clickable
document.querySelector('.upload-area').addEventListener('click', function() {
    document.getElementById('projectUpload').click();
});

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.querySelector('.upload-area').addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Process uploaded files to extract project information
async function processUploadedFiles(files) {
    const projectData = {
        name: 'Project',
        description: '',
        files: [],
        languages: new Set(),
        hasPackageJson: false,
        hasRequirements: false,
        hasDockerfile: false,
        packageJsonContent: null,
        requirementsContent: null
    };
    
    for (const file of files) {
        const fileName = file.name.toLowerCase();
        const filePath = file.webkitRelativePath || file.name;
        
        // Extract project name from first folder
        if (!projectData.name || projectData.name === 'Project') {
            const pathParts = filePath.split('/');
            if (pathParts.length > 1) {
                projectData.name = pathParts[0];
            }
        }
        
        // Read package.json content
        if (fileName === 'package.json') {
            projectData.hasPackageJson = true;
            try {
                const text = await file.text();
                projectData.packageJsonContent = JSON.parse(text);
            } catch (e) {
                console.warn('Could not parse package.json:', e);
            }
        }
        
        // Read requirements.txt content
        if (fileName === 'requirements.txt') {
            projectData.hasRequirements = true;
            try {
                projectData.requirementsContent = await file.text();
            } catch (e) {
                console.warn('Could not read requirements.txt:', e);
            }
        }
        
        // Detect file types and languages
        if (fileName.endsWith('.js')) projectData.languages.add('JavaScript');
        if (fileName.endsWith('.py')) projectData.languages.add('Python');
        if (fileName.endsWith('.java')) projectData.languages.add('Java');
        if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) projectData.languages.add('C++');
        if (fileName.endsWith('.html')) projectData.languages.add('HTML');
        if (fileName.endsWith('.css')) projectData.languages.add('CSS');
        if (fileName.endsWith('.php')) projectData.languages.add('PHP');
        if (fileName.endsWith('.rb')) projectData.languages.add('Ruby');
        if (fileName.endsWith('.go')) projectData.languages.add('Go');
        if (fileName.endsWith('.rs')) projectData.languages.add('Rust');
        
        // Check for important files
        if (fileName === 'dockerfile') projectData.hasDockerfile = true;
        
        projectData.files.push({
            name: file.name,
            path: filePath,
            size: file.size
        });
    }
    
    projectData.languages = Array.from(projectData.languages);
    return projectData;
}

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

async function generateSmartReadme(projectData, purpose, sections, customDescription = '') {
    const { name, languages, files, hasPackageJson, hasRequirements, hasDockerfile, packageJsonContent, requirementsContent } = projectData;
    
    const customContext = purpose === 'custom' && customDescription ? 
        `\nCustom Requirements: ${customDescription}` : '';
    
    // Analyze project structure
    const hasTests = files.some(f => f.name.toLowerCase().includes('test') || f.name.toLowerCase().includes('spec'));
    const hasCI = files.some(f => f.path.includes('.github') || f.path.includes('.gitlab-ci'));
    const hasLicense = files.some(f => f.name.toLowerCase().includes('license'));
    
    // Extract actual dependencies and analyze project type
    let actualDependencies = '';
    let projectType = 'application';
    let frameworksUsed = [];
    
    if (packageJsonContent) {
        const deps = Object.keys(packageJsonContent.dependencies || {});
        const devDeps = Object.keys(packageJsonContent.devDependencies || {});
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
        if (deps.includes('socket.io')) frameworksUsed.push('Socket.IO');
        if (deps.includes('axios')) frameworksUsed.push('Axios');
        if (deps.includes('lodash')) frameworksUsed.push('Lodash');
        if (deps.includes('moment')) frameworksUsed.push('Moment.js');
        if (deps.includes('jwt') || deps.includes('jsonwebtoken')) frameworksUsed.push('JWT Authentication');
    }
    
    if (requirementsContent && languages.includes('Python')) {
        const pythonDeps = requirementsContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        actualDependencies += `\nPython Dependencies: ${pythonDeps.join(', ')}`;
        
        // Detect Python frameworks
        if (pythonDeps.some(dep => dep.includes('django'))) { projectType = 'Django application'; frameworksUsed.push('Django'); }
        if (pythonDeps.some(dep => dep.includes('flask'))) { projectType = 'Flask application'; frameworksUsed.push('Flask'); }
        if (pythonDeps.some(dep => dep.includes('fastapi'))) { projectType = 'FastAPI application'; frameworksUsed.push('FastAPI'); }
        if (pythonDeps.some(dep => dep.includes('numpy'))) frameworksUsed.push('NumPy');
        if (pythonDeps.some(dep => dep.includes('pandas'))) frameworksUsed.push('Pandas');
        if (pythonDeps.some(dep => dep.includes('tensorflow'))) frameworksUsed.push('TensorFlow');
        if (pythonDeps.some(dep => dep.includes('pytorch'))) frameworksUsed.push('PyTorch');
    }
    
    const prompt = `Generate a comprehensive, professional README.md ONLY using actual project data. DO NOT invent features or functionality.

PROJECT ANALYSIS:
- Name: ${name}
- Languages: ${languages.join(', ')}
- Project Type: ${projectType}
- Frameworks/Libraries: ${frameworksUsed.join(', ') || 'None detected'}
- Files: ${files.slice(0, 20).map(f => f.name).join(', ')}
- Has Tests: ${hasTests}
- Has Docker: ${hasDockerfile}
- Has CI/CD: ${hasCI}
- Has License: ${hasLicense}
- Package Manager: ${hasPackageJson ? 'npm/yarn' : hasRequirements ? 'pip' : 'None detected'}
${actualDependencies}${customContext}

STRICT REQUIREMENTS:
1. Base ALL content on actual project data
2. Only mention features that exist in the codebase
3. Use actual dependencies for tech stack
4. Create realistic installation steps based on package managers found
5. NO EMOJIS unless custom requirements specifically request them
6. Make it ${purpose}-focused but accurate

Generate sections:
- Clean title
- Compelling description based on actual project purpose
- Features (inferred from actual files/dependencies)
- Tech stack (actual languages/frameworks only)
- Installation guide (based on actual package files)
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

    const apiKey = window.ENV?.GEMINI_API_KEY || 'AIzaSyD31nkxGXOf4IF2ZgTyXCXHx9uFliqiHnI';
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
