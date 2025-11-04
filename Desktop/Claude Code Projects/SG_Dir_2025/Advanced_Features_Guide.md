# Advanced Features: Claude Code SaaS with OpenRouter, Jina, & Playwright

## Table of Contents
1. [OpenRouter API Integration](#openrouter-api-integration)
2. [Jina API for Web Scraping](#jina-api-for-web-scraping)
3. [Audio Transcription Features](#audio-transcription-features)
4. [Playwright CSS Extraction](#playwright-css-extraction)
5. [AI Sub-Agents Architecture](#ai-sub-agents-architecture)
6. [Production Ready Implementation](#production-ready-implementation)

---

## OpenRouter API Integration

### Setup & Configuration

```bash
# 1. Get OpenRouter API key
# Visit: https://openrouter.ai/keys
# Create new API key - save it securely

# 2. Add to environment variables
netlify env:set OPENROUTER_API_KEY "sk_or_xxxx..."
# OR for local development:
echo "OPENROUTER_API_KEY=sk_or_xxxx..." >> .env.local

# 3. Verify API key works
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer sk_or_xxxx"

# 4. Install OpenRouter client (optional - we'll use fetch)
npm install openai
```

### Using OpenRouter for AI Decisions

```typescript
// lib/openrouter/client.ts
export async function askOpenRouter(
  prompt: string,
  model: string = "google/gemini-2.5-flash"
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Singapore Halal Directory",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`OpenRouter error: ${data.error.message}`);
  }

  return data.choices[0]?.message?.content || "";
}

// Example: Use AI to generate search terms
export async function generateSearchTerms(userQuery: string): Promise<string[]> {
  const prompt = `Given this user request: "${userQuery}"
  
Generate 5-10 specific, high-intent search queries to find relevant businesses.
Return ONLY a JSON array of strings, no other text.
Example: ["halal restaurants near me", "certified halal restaurants Singapore"]`;

  const response = await askOpenRouter(prompt);
  
  try {
    return JSON.parse(response);
  } catch {
    return [userQuery]; // Fallback
  }
}
```

### Using OpenRouter with Images

```typescript
// lib/openrouter/image.ts
export async function analyzeImage(imageUrl: string, question: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
      "X-Title": "Singapore Halal Directory",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: question
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1024
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Example: Extract business details from image
export async function extractBusinessDetails(imageUrl: string): Promise<{
  businessName?: string;
  phone?: string;
  address?: string;
  hours?: string;
}> {
  const prompt = `Extract these details from the business image/screenshot:
- Business name
- Phone number
- Address
- Operating hours

Return as JSON object with keys: businessName, phone, address, hours`;

  const response = await analyzeImage(imageUrl, prompt);
  
  try {
    return JSON.parse(response);
  } catch {
    return {};
  }
}
```

### Using OpenRouter with Audio

```typescript
// lib/openrouter/audio.ts
import * as fs from 'fs';
import * as path from 'path';

export async function transcribeAudio(audioBase64: string, format: string = 'wav'): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
      "X-Title": "Singapore Halal Directory",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please transcribe this audio file exactly as spoken."
            },
            {
              type: "input_audio",
              input_audio: {
                data: audioBase64,
                format
              }
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Example API endpoint for voice note submission
// app/api/submit-voice-note.ts
import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/openrouter/audio';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  // Convert audio to base64
  const buffer = await audioFile.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  // Transcribe
  const transcript = await transcribeAudio(base64, 'wav');

  // Use transcript as search query
  // Process with Jina and OpenRouter as below...

  return NextResponse.json({ transcript, success: true });
}
```

---

## Jina API for Web Scraping

### Setup & Configuration

```bash
# 1. Get Jina API key
# Visit: https://jina.ai/
# Sign up and get API key

# 2. Add to environment
netlify env:set JINA_API_KEY "jina_xxxx..."
echo "JINA_API_KEY=jina_xxxx..." >> .env.local

# 3. Test Jina API
curl -X GET "https://r.jina.ai/https://www.example.com" \
  -H "Authorization: Bearer jina_xxxx..."
```

### Using Jina for Search Results (s.jina)

```typescript
// lib/jina/search.ts
export async function searchWithJina(query: string): Promise<string> {
  const searchUrl = `https://s.jina.ai/?q=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
      'X-Respond-With': 'markdown' // Get markdown format
    }
  });

  if (!response.ok) {
    throw new Error(`Jina search failed: ${response.statusText}`);
  }

  return await response.text();
}

// Example: Find halal restaurants in area using search
export async function findHalalBusinesses(areaName: string, businessType: string) {
  const query = `halal ${businessType} in ${areaName} Singapore contact phone address`;
  const searchResults = await searchWithJina(query);
  
  // Results are in markdown format with links
  return parseSearchResults(searchResults);
}

function parseSearchResults(markdown: string): string[] {
  // Extract URLs from markdown
  const urlRegex = /\[.*?\]\((https?:\/\/[^\)]+)\)/g;
  const urls: string[] = [];
  let match;
  
  while ((match = urlRegex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}
```

### Using Jina for Page Scraping (r.jina)

```typescript
// lib/jina/scrape.ts
export async function scrapePageWithJina(url: string): Promise<string> {
  const response = await fetch(`https://r.jina.ai/${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
      'X-Respond-With': 'markdown' // Get clean markdown
    }
  });

  if (!response.ok) {
    throw new Error(`Jina scrape failed: ${response.statusText}`);
  }

  return await response.text();
}

// Example: Extract business details from website
export async function extractBusinessDetailsFromWebsite(url: string) {
  const pageContent = await scrapePageWithJina(url);
  
  // Use OpenRouter to extract structured data from content
  const prompt = `From this webpage content, extract:
- Business name
- Phone number (in E.164 format if possible)
- Address
- Postal code
- Operating hours
- Website URL
- Email
- Halal certification type

Content:
${pageContent}

Return as JSON object`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024
    })
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
```

### Batch Processing with Jina

```typescript
// lib/jina/batch.ts
export async function scrapeBatch(urls: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  // Process with delays to avoid rate limits
  for (const url of urls) {
    try {
      const content = await scrapePageWithJina(url);
      results.set(url, content);
      
      // Delay between requests (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      results.set(url, '');
    }
  }
  
  return results;
}

// Example: Find and scrape all Shopify stores in area
export async function findAndScrapeShopifyStores(areaName: string) {
  // 1. Generate search terms with OpenRouter
  const searchTerms = await generateSearchTerms(`shopify stores halal products ${areaName}`);
  
  // 2. Search with Jina
  const searchResults = await searchWithJina(searchTerms[0]);
  const urls = parseSearchResults(searchResults);
  
  // 3. Filter for Shopify stores
  const shopifyUrls = urls.filter(url => 
    url.includes('shopify') || url.includes('myshopify')
  );
  
  // 4. Scrape all pages
  const scrapedData = await scrapeBatch(shopifyUrls);
  
  // 5. Extract business data with OpenRouter
  const businesses = [];
  for (const [url, content] of scrapedData) {
    if (content) {
      const details = await extractBusinessDetailsFromContent(content);
      businesses.push({ url, ...details });
    }
  }
  
  return businesses;
}
```

---

## Audio Transcription Features

### Recording Audio in Frontend

```typescript
// lib/audio/recorder.ts
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      this.audioChunks.push(event.data);
    });

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob());
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  async getBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data:audio/wav;base64, prefix
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }
}
```

### Voice Note Submit Component

```typescript
// components/VoiceNoteRecorder.tsx
import React, { useState } from 'react';
import { AudioRecorder } from '@/lib/audio/recorder';

export function VoiceNoteRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const recorder = new AudioRecorder();

  const handleStartRecording = async () => {
    await recorder.startRecording();
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setLoading(true);

    const audioBlob = await recorder.stopRecording();
    const base64Audio = await recorder.getBase64(audioBlob);

    // Send to backend for transcription
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: base64Audio,
        format: 'wav'
      })
    });

    const data = await response.json();
    setTranscript(data.transcript);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Submit Voice Note</h3>
      
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          isRecording ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        {loading ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-bold">Transcript:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
```

### Backend Transcription Endpoint

```typescript
// app/api/transcribe.ts
import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/openrouter/audio';
import { askOpenRouter } from '@/lib/openrouter/client';

export async function POST(request: NextRequest) {
  try {
    const { audio, format = 'wav' } = await request.json();

    // Transcribe audio
    const transcript = await transcribeAudio(audio, format);

    // Optionally: Clean up and enhance transcript with AI
    const cleanedTranscript = await askOpenRouter(`
      Clean up this voice transcription for clarity:
      "${transcript}"
      
      Return only the cleaned text, no extra commentary.
    `);

    return NextResponse.json({
      transcript: cleanedTranscript,
      success: true
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
```

---

## Playwright CSS Extraction

### Extracting CSS from Reference Site

```bash
# 1. Start Playwright Inspector
npx playwright codegen https://www.clay.com

# 2. In the Inspector window:
#    - Click on elements you want to replicate
#    - Right-click → Inspect
#    - Copy CSS from DevTools
#    - Playwright records all actions

# 3. Export recorded test
# Copy the code from Inspector into your test file
```

### Automated CSS Extraction Script

```typescript
// scripts/extract-css.ts
import { chromium } from 'playwright';
import * as fs from 'fs';

async function extractCSSFromSite(targetUrl: string, outputFile: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(targetUrl);

  // Extract all stylesheets
  const stylesheets = await page.evaluate(() => {
    const sheets = document.querySelectorAll('link[rel="stylesheet"], style');
    const cssContent: string[] = [];

    sheets.forEach((sheet) => {
      if (sheet instanceof HTMLLinkElement) {
        // External stylesheet - would need to fetch
        cssContent.push(`/* External: ${sheet.href} */`);
      } else if (sheet instanceof HTMLStyleElement) {
        cssContent.push(sheet.textContent || '');
      }
    });

    return cssContent.join('\n\n');
  });

  // Extract colors from page
  const colors = await page.evaluate(() => {
    const colorMap: Record<string, string> = {};

    document.querySelectorAll('*').forEach((el) => {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      const borderColor = styles.borderColor;

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        colorMap[`bg-${Object.keys(colorMap).length}`] = bgColor;
      }
      if (textColor) {
        colorMap[`text-${Object.keys(colorMap).length}`] = textColor;
      }
    });

    return colorMap;
  });

  // Save extracted CSS
  const output = `
/* Extracted CSS from ${targetUrl} */

/* Colors Found */
${Object.entries(colors)
  .map(([name, color]) => `--${name}: ${color};`)
  .join('\n')}

/* Stylesheets */
${stylesheets}
  `;

  fs.writeFileSync(outputFile, output);
  console.log(`CSS extracted to ${outputFile}`);

  await browser.close();
}

// Run extraction
extractCSSFromSite('https://www.clay.com', 'extracted-css.css');
```

### Creating Custom Theme from Extracted CSS

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        halal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        featured: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        certified: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        featured: '0 0 0 3px rgb(3, 105, 161)', // Blue border
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## AI Sub-Agents Architecture

### Sub-Agent System

```typescript
// lib/agents/types.ts
export interface Agent {
  name: string;
  role: string;
  instructions: string;
  executeTask(task: string, context?: any): Promise<any>;
}

// lib/agents/search-agent.ts
import { askOpenRouter } from '@/lib/openrouter/client';
import { searchWithJina } from '@/lib/jina/search';
import { scrapePageWithJina } from '@/lib/jina/scrape';

export class SearchAgent implements Agent {
  name = 'Search Agent';
  role = 'Finds relevant businesses through intelligent searching';
  instructions = `You are a business search specialist. Your job is to:
1. Understand what type of business the user is looking for
2. Generate specific, high-intent search queries
3. Search for results using web search
4. Evaluate and prioritize results
5. Extract contact details and business information`;

  async executeTask(businessType: string, areaName: string) {
    // Step 1: Generate search terms
    const searchTerms = await askOpenRouter(`
      Generate 5 specific search queries to find ${businessType} businesses in ${areaName}, Singapore.
      Focus on finding contact information and business locations.
      Return as JSON array: ["query1", "query2", ...]
    `);

    const queries = JSON.parse(searchTerms);
    
    // Step 2: Execute searches
    const allResults = [];
    for (const query of queries) {
      const results = await searchWithJina(query);
      allResults.push(results);
    }

    // Step 3: Return to coordinator
    return {
      agent: this.name,
      status: 'complete',
      results: allResults
    };
  }
}

// lib/agents/scraper-agent.ts
export class ScraperAgent implements Agent {
  name = 'Scraper Agent';
  role = 'Extracts detailed business information from websites';
  instructions = `You are a data extraction specialist. Your job is to:
1. Visit business websites
2. Extract all relevant information
3. Verify accuracy of extracted data
4. Return structured data`;

  async executeTask(urls: string[]) {
    const extractedData = [];

    for (const url of urls) {
      try {
        const content = await scrapePageWithJina(url);
        const details = await askOpenRouter(`
          Extract these from the webpage:
          - Business name
          - Phone
          - Address
          - Hours
          - Halal certification
          
          Webpage: ${content}
          
          Return JSON object
        `);
        
        extractedData.push(JSON.parse(details));
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

    return {
      agent: this.name,
      status: 'complete',
      data: extractedData
    };
  }
}

// lib/agents/coordinator.ts
export class CoordinatorAgent {
  private agents: Agent[] = [];

  registerAgent(agent: Agent) {
    this.agents.push(agent);
  }

  async executeWorkflow(userRequest: string) {
    // Step 1: Understand request with main AI
    const plan = await askOpenRouter(`
      Break down this user request into tasks for sub-agents:
      "${userRequest}"
      
      Output JSON with:
      - agentName: which agent to use
      - task: specific task
      - expectedOutput: what we expect back
    `);

    const tasks = JSON.parse(plan);
    
    // Step 2: Execute tasks with sub-agents
    const results = {};
    for (const task of tasks) {
      const agent = this.agents.find(a => a.name === task.agentName);
      if (agent) {
        results[task.agentName] = await agent.executeTask(task.task);
      }
    }

    // Step 3: Synthesize results
    const finalResult = await askOpenRouter(`
      Synthesize these agent results into a comprehensive response:
      ${JSON.stringify(results, null, 2)}
      
      Format as professional summary with action items.
    `);

    return finalResult;
  }
}
```

### Using Sub-Agents

```typescript
// Example: Use agents for lead finding
import { SearchAgent } from '@/lib/agents/search-agent';
import { ScraperAgent } from '@/lib/agents/scraper-agent';
import { CoordinatorAgent } from '@/lib/agents/coordinator';

async function findLeads(userRequest: string) {
  // Initialize coordinator and agents
  const coordinator = new CoordinatorAgent();
  coordinator.registerAgent(new SearchAgent());
  coordinator.registerAgent(new ScraperAgent());

  // Execute workflow
  const results = await coordinator.executeWorkflow(userRequest);
  
  return results;
}

// API endpoint
// app/api/find-leads.ts
export async function POST(request: NextRequest) {
  const { query } = await request.json();
  
  const leads = await findLeads(query);
  
  return NextResponse.json({ leads, success: true });
}
```

---

## Production Ready Implementation

### Error Handling & Retry Logic

```typescript
// lib/utils/retry.ts
export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Usage with Jina
export async function scrapeWithRetry(url: string) {
  return retryWithExponentialBackoff(
    () => scrapePageWithJina(url),
    3,
    1000
  );
}
```

### Rate Limiting

```typescript
// lib/utils/rate-limit.ts
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      console.log(`Rate limit reached, waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(10, 60000); // 10 requests per minute

for (const url of urls) {
  await limiter.waitIfNeeded();
  const content = await scrapeWithRetry(url);
}
```

### Logging & Monitoring

```typescript
// lib/utils/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private level: LogLevel;

  constructor(level = LogLevel.INFO) {
    this.level = level;
  }

  debug(message: string, data?: any) {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    if (this.level <= LogLevel.INFO) {
      console.log(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, error?: any) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
}

// Usage
const logger = new Logger(LogLevel.INFO);
logger.info('Starting business search...');
```

### Production Configuration

```typescript
// config/production.ts
export const productionConfig = {
  // API Configuration
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.5-flash',
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000,
  },

  jina: {
    baseUrl: 'https://r.jina.ai',
    searchUrl: 'https://s.jina.ai',
    timeout: 30000,
    maxRetries: 3,
  },

  // Rate Limiting
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerHour: 500,
  },

  // Retry Configuration
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
  },

  // Logging
  logging: {
    level: 'INFO',
    enableFileLogging: true,
    logFilePath: './logs/app.log',
  },

  // Caching
  cache: {
    enabled: true,
    ttlSeconds: 3600,
    provider: 'redis', // or 'memory'
  },
};
```

---

## Summary

This advanced features guide provides:

✅ **OpenRouter Integration** - AI-powered decisions and text generation
✅ **Jina API** - Search and scraping capabilities
✅ **Audio Transcription** - Voice note support
✅ **Playwright CSS Extraction** - Automated theme generation
✅ **Sub-Agent Architecture** - Distributed task execution
✅ **Production Readiness** - Error handling, retry logic, rate limiting, logging

**All components work together** to create an intelligent, scalable SaaS platform.

**Key Features:**
- AI-powered search term generation
- Intelligent web scraping with error handling
- Voice note transcription and processing
- Automated CSS extraction from reference sites
- Distributed agent system for complex tasks
- Production-grade error handling and monitoring

**Next Steps:**
1. Set up OpenRouter and Jina API keys
2. Implement agents one at a time
3. Test with sample data
4. Deploy with monitoring
5. Scale based on usage patterns
