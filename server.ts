import express, { type Request, type Response, type NextFunction } from 'express';
import compression from 'compression';
import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
// In production the built client (index.html + assets) sits in dist/, alongside
// the bundled server. `npm run start` is invoked from the project root, so we
// resolve the static directory from cwd — robust in both ESM (dev) and the
// esbuild CJS bundle, where import.meta.url isn't available.
const STATIC_DIR = path.resolve(process.cwd(), 'dist');

/* ------------------------------------------------------------------ */
/*  AI Diaspora Spotlight generation (Gemini) with graceful fallback   */
/* ------------------------------------------------------------------ */

interface SpotlightRequest {
  profession?: string;
  region?: string;
}

interface Spotlight {
  name: string;
  profession: string;
  region: string;
  headline: string;
  journey: string;
  quote: string;
  impact: { label: string; value: string }[];
  advice: string;
  source: 'ai' | 'fallback';
}

const FALLBACK_SPOTLIGHTS: Omit<Spotlight, 'source'>[] = [
  {
    name: 'Dr. Adaeze Okonkwo',
    profession: 'NHS Consultant Cardiologist',
    region: 'London',
    headline: 'From Enugu to leading a London cardiology unit',
    journey:
      'Adaeze arrived in the UK in 2009 to complete her specialist training. After a decade of night shifts and relentless study, she now leads one of London’s busiest cardiology units and mentors newly-arrived Nigerian doctors navigating the NHS.',
    quote: 'Your accent is not a barrier — it is proof you speak more than one world.',
    impact: [
      { label: 'Patients treated yearly', value: '3,200+' },
      { label: 'Doctors mentored', value: '84' },
      { label: 'Years in the NHS', value: '15' },
    ],
    advice: 'Find one senior ally in your first year. The system rewards those who ask early, not those who suffer silently.',
  },
  {
    name: 'Bisi Adeyemi',
    profession: 'Fintech Founder & CEO',
    region: 'London',
    headline: 'Building payment rails between the UK and West Africa',
    journey:
      'A former investment analyst, Bisi bootstrapped a remittance startup from her Hackney flat. Today her company moves millions in diaspora payments and has raised institutional capital from UK and pan-African funds.',
    quote: 'The diaspora is not a market to be served — it is a movement to be organised.',
    impact: [
      { label: 'Capital deployed', value: '£2.4M' },
      { label: 'Active users', value: '61,000' },
      { label: 'Team members', value: '38' },
    ],
    advice: 'Raise less than you think you need at first. Constraint is the best product manager you will ever hire.',
  },
  {
    name: 'Funmilayo Bello',
    profession: 'Immigration Solicitor',
    region: 'Midlands',
    headline: 'Winning asylum and settlement cases across the Midlands',
    journey:
      'Funmilayo requalified as a solicitor after arriving with a Nigerian law degree. She founded a Birmingham practice specialising in immigration and now trains community advocates on their rights.',
    quote: 'Justice delayed for our people is not justice — it is administrative violence. We fight the paperwork.',
    impact: [
      { label: 'Cases won', value: '470+' },
      { label: 'Free clinics run', value: '120' },
      { label: 'Advocates trained', value: '56' },
    ],
    advice: 'Document everything. In immigration, the person with the tidiest bundle usually wins.',
  },
  {
    name: 'Chiamaka Eze',
    profession: 'Creative Director',
    region: 'North West',
    headline: 'Putting Ankara on Manchester’s biggest stages',
    journey:
      'Chiamaka blends Nigerian textile heritage with British contemporary design. Her Manchester studio has dressed festivals, theatre productions and a Premier League club’s cultural campaign.',
    quote: 'We do not water down our culture to fit the room — we make the room bigger.',
    impact: [
      { label: 'Collections shown', value: '22' },
      { label: 'Artisans employed', value: '31' },
      { label: 'Mothers mentored', value: '450+' },
    ],
    advice: 'Charge what your heritage is worth. Undercharging is not humility — it is erasure.',
  },
];

function pickFallback(req: SpotlightRequest): Spotlight {
  const pool = FALLBACK_SPOTLIGHTS.filter((s) => {
    const okProf = !req.profession || s.profession.toLowerCase().includes(req.profession.toLowerCase().split(' ')[0]);
    const okRegion = !req.region || s.region.toLowerCase() === req.region.toLowerCase();
    return okProf || okRegion;
  });
  const chosen = (pool.length ? pool : FALLBACK_SPOTLIGHTS)[
    Math.floor(Math.random() * (pool.length ? pool.length : FALLBACK_SPOTLIGHTS.length))
  ];
  return { ...chosen, source: 'fallback' };
}

async function generateSpotlight(body: SpotlightRequest): Promise<Spotlight> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return pickFallback(body);

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const profession = body.profession || 'a Nigerian professional woman';
    const region = body.region || 'the UK';

    const prompt = `Generate an authentic, uplifting career spotlight of a Nigerian woman working as ${profession} in ${region}. Respond ONLY with strict JSON matching this shape:
{"name":string,"profession":string,"region":string,"headline":string,"journey":string(2-3 sentences),"quote":string,"impact":[{"label":string,"value":string}] (exactly 3),"advice":string}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = result.text ?? '';
    const parsed = JSON.parse(text);
    return { ...parsed, source: 'ai' as const };
  } catch (err) {
    console.warn('[stories] Gemini generation failed, using fallback:', (err as Error).message);
    return pickFallback(body);
  }
}

/* ------------------------------------------------------------------ */
/*  Server bootstrap                                                   */
/* ------------------------------------------------------------------ */

async function createServer() {
  const app = express();
  app.use(compression());
  app.use(express.json());

  // --- API routes ---
  app.post('/api/stories/generate', async (req: Request, res: Response) => {
    try {
      const spotlight = await generateSpotlight(req.body ?? {});
      res.json(spotlight);
    } catch {
      res.status(200).json(pickFallback(req.body ?? {}));
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', ai: Boolean(process.env.GEMINI_API_KEY) });
  });

  if (!isProd) {
    // Dev: attach Vite as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Prod: serve the pre-built client assets from dist/.
    app.use(express.static(STATIC_DIR, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(STATIC_DIR, 'index.html'));
    });
  }

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ NWUK platform running at http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

createServer();
