```javascript
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Configuration
const MAX_ATTEMPTS = 5;
const API_KEY = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY; // Support either/or
const API_URL = process.env.OPENAI_API_KEY
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.anthropic.com/v1/messages';

if (!API_KEY) {
    console.error("❌ No API Key found. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY.");
    process.exit(1);
}

const PROVIDER = process.env.OPENAI_API_KEY ? 'openai' : 'anthropic';

async function runBuild() {
    return new Promise((resolve) => {
        console.log("🔨 Running 'npm run build'...");
        const build = spawn('npm', ['run', 'build'], { shell: true, stdio: ['inherit', 'pipe', 'pipe'] });

        let stdout = '';
        let stderr = '';

        build.stdout.on('data', (data) => {
            const output = data.toString();
            process.stdout.write(output);
            stdout += output;
        });

        build.stderr.on('data', (data) => {
            const output = data.toString();
            process.stderr.write(output);
            stderr += output;
        });

        build.on('close', (code) => {
            resolve({ success: code === 0, stdout, stderr });
        });
    });
}

function getSystemPrompt() {
    return `You are an automated code - fixing agent. 
The user's build failed. You will receive the build stderr.
Return a JSON object with a 'files' property containing an array of file updates.
Each item in 'files' must have 'path'(relative to project root) and 'content'(the new full file content).
Do NOT return markdown.Return ONLY raw JSON.
    Example:
{
    "files": [
        {
            "path": "src/components/Broken.astro",
            "content": "..."
        }
    ]
} `;
}

async function askAgentOpenAI(errorLog) {
    const payload = {
        model: "gpt-4o",
        messages: [
            { role: "system", content: getSystemPrompt() },
            { role: "user", content: `Build failed with error: \n${ errorLog } \n\nPlease fix the code.` }
        ],
        response_format: { type: "json_object" }
    };

    return await makeRequest(payload);
}

async function askAgentAnthropic(errorLog) {
    const payload = {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        system: getSystemPrompt(),
        messages: [
            { role: "user", content: `Build failed with error: \n${ errorLog } \n\nPlease fix the code.Return JSON.` }
        ]
    };
    return await makeRequest(payload);
}

async function makeRequest(payload) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (PROVIDER === 'openai') {
        headers['Authorization'] = `Bearer ${ API_KEY } `;
    } else {
        headers['x-api-key'] = API_KEY;
        headers['anthropic-version'] = '2023-06-01';
    }

    return new Promise((resolve, reject) => {
        const req = https.request(API_URL, {
            method: 'POST',
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    reject(new Error(`API Request Failed: ${ res.statusCode } ${ data } `));
                } else {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify(payload));
        req.end();
    });
}

async function applyFixes(agentResponse) {
    let filesToUpdate = [];

    if (PROVIDER === 'openai') {
        const content = JSON.parse(agentResponse.choices[0].message.content);
        filesToUpdate = content.files;
    } else {
        // Anthropic
        const text = agentResponse.content[0].text;
        // Basic extraction if it wrapped in markdown codes, though system prompt forbids it
        const jsonStr = text.replace(/```json\n ?|\n ? ```/g, '');
        const content = JSON.parse(jsonStr);
        filesToUpdate = content.files;
    }

    if (!filesToUpdate || filesToUpdate.length === 0) {
        console.log("🤔 Agent suggested no changes.");
        return false;
    }

    console.log(`💡 Agent provided fixes for ${ filesToUpdate.length } file(s).Applying...`);

    for (const file of filesToUpdate) {
        const absolutePath = path.resolve(process.cwd(), file.path);
        console.log(`   Writing ${ file.path }...`);
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, file.content);
    }
    return true;
}

async function startPoltergeist() {
    console.log("👻 Poltergeist is awake. Watching your build...");

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        console.log(`\n-- - Attempt ${ i }/${MAX_ATTEMPTS} ---`);
const { success, stderr } = await runBuild();

if (success) {
    console.log("\n✅ Build passed! My work here is done.");
    process.exit(0);
}

console.log("\n❌ Build failed.");
if (i === MAX_ATTEMPTS) {
    console.error("💀 Max attempts reached. Giving up.");
    process.exit(1);
}

console.log("🧠 Asking the Agent for a fix...");
try {
    const response = PROVIDER === 'openai'
        ? await askAgentOpenAI(stderr)
        : await askAgentAnthropic(stderr);

    const applied = await applyFixes(response);
    if (!applied) {
        console.log("No fixes applied. Stopping.");
        process.exit(1);
    }
} catch (error) {
    console.error("🔥 Error communicating with Agent:", error.message);
    process.exit(1);
}
    }
}

startPoltergeist();
