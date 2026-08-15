import type { Spotlight } from '../types';

// Client-side curated spotlights. Used when the /api/stories endpoint isn't
// reachable (e.g. a static deployment with no Node server), so the Inspiring
// Stories feature keeps working with zero UI downtime.
const CURATED: Omit<Spotlight, 'source'>[] = [
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

export function pickFallbackSpotlight(profession?: string, region?: string): Spotlight {
  const pool = CURATED.filter((s) => {
    const okProf = !profession || profession === 'Any' || s.profession.toLowerCase().includes(profession.toLowerCase().split(' ')[0]);
    const okRegion = !region || region === 'Any' || s.region.toLowerCase() === region.toLowerCase();
    return okProf || okRegion;
  });
  const list = pool.length ? pool : CURATED;
  return { ...list[Math.floor(Math.random() * list.length)], source: 'fallback' };
}
