// Cafeteria small-talk — neutral office edition.
//
// An agent's coffee break is an excuse for a quick one-liner. Two kinds of line:
//   • solo  — one quip shown above a single agent at a break spot
//   • pair  — a two-beat exchange between two agents at the same table
//
// Lines are kept short so they fit the ThoughtBubble (≈MAX_WIDTH). Character
// keys match OfficeCharacterName; anyone without bespoke lines falls back to the
// shared GENERIC pool so the floor never feels empty.

import type { OfficeCharacterName } from './cast';

/** Where an agent is lingering — picks a contextual line pool. */
export type BreakSpot = 'coffee' | 'vending' | 'snack' | 'table';

const pick = <T,>(arr: readonly T[], seed: number): T =>
  arr[((seed % arr.length) + arr.length) % arr.length];

// ─── solo lines, by spot ─────────────────────────────────────────────────────

const COFFEE: readonly string[] = [
  'is this… decaf?? who did this',
  "we're out of beans again",
  'Best mug on the floor',
  'first cup of the day. and the fifth.',
  'the coffee here is basically a hug',
  'who took my mug?',
];

const VENDING: readonly string[] = [
  'the machine ate my dollar',
  'B4… please be the pretzels',
  'it’s stuck. classic.',
  'shaking it. gently. respectfully.',
  'one (1) emotional-support snack',
  'A1 again. living dangerously.',
];

const SNACK: readonly string[] = [
  'is it snack day?',
  'who finished the chips??',
  'just a little treat',
  'these are everyone’s? cool cool cool',
  'second breakfast',
];

const TABLE: readonly string[] = [
  'big day. lots of meetings.',
  'just five more minutes',
  'did you see the standup notes?',
  'pretending to read my notes',
  'I needed this break, honestly',
  'do NOT tell Aria I’m in here',
];

const SPOT_POOL: Record<BreakSpot, readonly string[]> = {
  coffee: COFFEE, vending: VENDING, snack: SNACK, table: TABLE,
};

// ─── character flavour — overrides the generic pool when present ─────────────

const BY_CHARACTER: Partial<Record<OfficeCharacterName, readonly string[]>> = {
  aria:  ['no meetings before coffee. that’s the rule.', 'that’s what she said', 'delegation is an art', 'the floor runs itself today. probably.'],
  milo:  ['did you read the spec?', 'the spec is clear.', 'I reviewed the diff twice', 'those tests are weak'],
  sage:  ['the docs wrote themselves today', 'I fixed the wording', 'this font is gorgeous'],
  bo:    ['the numbers finally balance', 'spreadsheet time', 'someone moved a decimal again'],
  iris:  ['the schedule is a mess', 'operations, people.', 'everything is on track. barely.'],
  noor:  ['the data is in', 'this graph is beautiful', 'correlation, not causation'],
  caleb: ['ticket triaged. next.', 'customer-first, always', 'that one’s on hold'],
  wren:  ['the prose needs work', 'deadlines are suggestions', 'I rewrote it three times'],
  theo:  ['growth numbers are up', 'roadmap, then coffee', 'big launch coming'],
  mia:   ['did you HEAR what happened??', 'so. much. to tell you.', 'the whole team is buzzing'],
  finn:  ['still learning the ropes', 'the intern needs caffeine', 'starting a side project, actually'],
  ezra:  ['I should write that up…', 'people ops, checking in', 'no one ever sits with me'],
  rex:   ['which one of you is new?', 'I saw that commit', 'least privilege, always'],
  hazel: ['is it 5 o’clock yet?', 'someone spike the coffee?', 'vendor calls. again.'],
  rowan: ['just here for the gossip', 'the build is green', 'question. yes. nothing. just checking.'],
};

/** A solo break-room line. Character flavour ~60% of the time, else the line
 *  fits the spot the agent is standing at. `seed` keeps it deterministic per
 *  call site (avoids Math.random, which Pixi/Electron CSP-safe code prefers). */
export function pickSoloLine(character: OfficeCharacterName, spot: BreakSpot, seed: number): string {
  const flavour = BY_CHARACTER[character];
  if (flavour && seed % 5 < 3) return pick(flavour, Math.floor(seed / 5));
  return pick(SPOT_POOL[spot], seed);
}

// ─── paired exchanges (two agents at one table) ──────────────────────────────
//
// Each exchange is a list of beats that ALTERNATE between the two agents:
// beat[0] = the speaker who sat down, beat[1] = their table-mate, beat[2] =
// speaker again, and so on. The director plays them out one beat at a time.
// Lines are trimmed to fit the thought cloud; longer ones auto-truncate.

type Exchange = readonly string[];

// Generic banter — works between any two agents.
const EXCHANGES: readonly Exchange[] = [
  ['world’s best lead.', 'you are. I had the mug made.', 'and I cherish it.'],
  ['would an idiot do this?', '...if yes, I don’t.', 'that’s my person.'],
  ['feared or loved? both.', 'that’s beautiful.', 'I know.'],
  ['I edited your wiki page again.', 'I know. thank you.'],
  ['question. how many tickets?', 'one.', 'that’s too many.'],
  ['fact: the build is green.', 'is it though?', 'I checked.'],
  ['I grew up on a dev branch.', 'shocking.', '...not shocking at all.'],
  ['what’s the release smell like?', 'victory. and tests.'],
  ['did you just throw your phone?', 'didn’t like what it said.', 'cool.'],
  ['is a hot dog a sandwich?', 'it is.', 'I know, right?'],
  ['three-hole-punch Rowan returns.', 'never gets old.'],
  ['why few word when lot word?', '...genuinely profound.', 'I know.'],
  ['I am not a bad person.', '...', 'not a great person either.', 'there it is.'],
  ['I love my cats more than people.', 'including us?', 'especially you.'],
  ['cats are better than dogs.', 'dogs are better.', '...sorry.'],
  ['do you love me?', 'I love… being here.', 'that’s a yes.'],
  ['I’m kind of a big deal.', 'you are?', 'in my mind. yes.'],
  ['did you miss me?', 'no.', 'a little?', '...there it is.'],
  ['did you just roll your eyes?', 'I did.', 'why?', 'muscle memory.'],
  ['I’ve watched that clock since 4.', 'weren’t you working?', 'watching the clock.'],
  ['what do we build again?', 'software.', 'sure, yeah.'],
  ['how old are you?', 'yeah.', 'that’s not an answer.', 'sure it is.'],
  ['that’s not how math works.', 'I know.', 'then why?', 'faster.'],
  ['I’m not an overworker.', 'you skipped lunch.', 'for the code.'],
  ['I went to that conference.', 'nobody cares.', 'I went to that conference.', 'still nobody cares.'],
  ['I have a lot of feelings.', 'I can tell.', 'is that bad?', 'for us? yes.'],
  ['why are you the way you are?', '...', 'honestly.'],
  ['your cat died.', 'I know.', 'I’m sorry.', '...thank you.'],
  ['stop looking at me.', 'you stop looking at me.'],
  ['sign this.', 'what is it?', 'doesn’t matter.', '...fine.'],
  ['you can’t say that.', 'I just did.', 'gonna stop me?', '...no.'],
  ['that’s a fire lane.', 'fire hasn’t happened yet.'],
  ['I wrapped your keyboard in Jello.', 'I’ll eat around it.', 'fair.'],
  ['zombie attack plan?', 'especially that.', 'of course.'],
  ['just seeing if you’d answer.', 'I hate you.', 'I know.'],
  ['a little superstitious, not super.', 'that’s not a word.', 'it is now.'],
  ['funniest person in the office?', 'and other times?', 'other times I know it.'],
  ['that’s what she said.', '...every time.', 'come on.'],
  ['I started the outage.', 'no you didn’t.', 'in our hearts, I did.'],
  ['is today a day ending in Y?', 'yes.', 'then no.'],
  ['you look great today.', '...I know.'],
  ['I’m better than you in every way.', 'probably.', 'definitely.', 'sure.'],
  ['I’m a nice person.', 'you’re okay.', 'nicest thing you’ve said.'],
  ['are you okay?', 'I’ve been worse.', 'when?', 'can’t narrow it down.'],
  ['there’s a spider on your desk.', 'where?', '...you ate it.', 'protein.'],
  ['soul mates can be leads.', 'you’re my lead.', 'exactly.'],
  ['standup ran 40 minutes.', 'could’ve been an email.'],
  ['is the build green yet?', '...don’t look.'],
  ['who reply-all’d everyone?', 'we don’t talk about it.'],
];

// ─── "that's what she said" ──────────────────────────────────────────────────
//
// A running office favourite. These are generic (added to the shared pool
// below) so ANY two agents at a table can run them: whoever sits down first
// delivers the innocent setup (beat 0) and their table-mate lands the punchline
// (beat 1). Some carry the follow-up beats — a sheepish clarification and
// the inevitable "still counts." Setups are trimmed to fit the thought cloud.
const TWSS_EXCHANGES: readonly Exchange[] = [
  ['taking way longer than I expected.', 'that’s what she said.'],
  ['it’s too big, can’t fit it in my mouth.', 'that’s what she said.'],
  ['you really need to slow down.', 'that’s what she said.'],
  ['gonna need a bigger one.', 'that’s what she said.'],
  ['help, I can’t get it to go in.', 'that’s what she said.'],
  ['it’s not that hard if you just push.', 'that’s what she said.'],
  ['I can’t do this all night.', 'that’s what she said.'],
  ['I need it now, I can’t wait.', 'that’s what she said.'],
  ['so hot in here, I’m sweating.', 'that’s what she said.'],
  ['it keeps slipping out of my hands.', 'that’s what she said.'],
  ['why not just stick it in already?', 'that’s what she said.', '*looks at camera*'],
  ['I just need a few more inches.', 'that’s what she said.', 'for the shelf!', 'still counts.'],
  ['make it louder, I can barely feel it.', 'that’s what she said.'],
  ['can we get this over with quickly?', 'that’s what she said.', 'I meant the meeting.', 'sure.'],
  ['I just need you to hold it steady.', 'that’s what she said.'],
  ['can’t believe I did that all morning.', 'that’s what she said.'],
  ['my hands are cramping.', 'that’s what she said.', 'from typing!', 'that’s what she said.'],
  ['hours in and barely halfway done.', 'that’s what she said.'],
  ['surprisingly heavy for its size.', 'that’s what she said.'],
  ['be more precise. less sloppy.', 'that’s what she said.', 'I meant the spreadsheet.', 'I know.'],
  ['how long was it?', 'that’s what she said.', '*the whole room goes quiet*', 'I’m sorry, I can’t help it.'],
  ['too tight, cutting off my circulation.', 'that’s what she said.', '*mouths thank you*'],
  ['I don’t think it’ll fit.', 'that’s what she said.', '*stands up and applauds*'],
  ['stop, you’re doing it wrong.', 'that’s what she said.', 'never been prouder.'],
  ['this just keeps getting harder.', 'that’s what she said.', 'he’s ready.'],
  ['not wide enough, I need more room.', 'that’s what she said.'],
  ['I can hold it a really long time.', 'that’s what she said.', 'my breath!', 'still.'],
  ['why is it taking so long?', 'that’s what she said.', 'I hate you.', 'then why set me up?'],
  ['I can’t do it with people watching.', 'that’s what she said.', 'the presentation!', 'sure.'],
  ['it’s deeper than it looks.', 'that’s what she said.', 'the pothole, Aria!', 'doesn’t matter.'],
  ['so much longer than last time.', 'that’s what she said.', 'the report, Aria.', 'right, right.'],
  ['oh my god, it went on FOREVER.', 'that’s what she said.', 'the meeting!', 'classic.'],
  ['can’t believe how thick this is.', 'that’s what she said.', 'the folder. *stares*'],
  ['I fit all THAT in one day?', 'that’s what she said.', 'that’s actually what I said!', 'meta.'],
  ['I went at it hard this morning.', 'that’s what she said.', 'at the gym!', 'irrelevant.'],
  ['someone help me finish this off.', 'that’s what she said.', 'the leftover cake!', 'still works.'],
  ['get in, do my thing, get out.', 'that’s what she said.', '*doesn’t look up from the board*'],
  ['can’t believe it took this long.', 'that’s what she said.', 'the raise. eight years.', 'that one’s on me.'],
  ['do it slower, it’ll hurt less.', 'that’s what she said.', 'for the quarterly review.', 'sure, Noor.'],
  ['didn’t realize how big it’d be.', 'that’s what she said.', 'the calzone, it’s enormous!', 'I love this office.'],
  ['*to no one* that’s what she said.', 'nobody said anything.', 'just thinking about earlier.'],
  ['*on the phone* that’s what she said.', 'who was that?', 'my mother. about a sandwich.'],
  ['too hot in here! that’s what she said.', 'you said both parts.', 'I contain multitudes.'],
  ['*at the TV* that’s what she said.', 'you’re alone, Aria.', 'she doesn’t know that.'],
  ['you need to be more professional.', 'that’s what she said.', 'I am she.', '...that’s what she said.'],
  ['stop. just stop. every time—', 'that’s what she said.', '*leaves the room*', '*whispers* that’s what she said.'],
  ['as you can see, it’s going up.', 'that’s what she said.', '*everyone groans*', 'set that one up myself.'],
  ['I declared a code freeze once. felt good.', 'what does that have to do with—', 'that’s what she said.', 'it doesn’t.', 'I know.'],
  ['you didn’t say it.', 'I know.', 'why not?', 'I’m growing.', '...that’s what she said.', 'there it is.'],
  ['impressive you held back today.', 'thank you.', 'I counted zero times.', 'that’s what she said.', 'still counts.'],
];

// Everything any table-mate pair can draw from.
const PAIR_POOL: readonly Exchange[] = [...EXCHANGES, ...TWSS_EXCHANGES];

// Keyed off the SPEAKER so, when the right character sits down first, they get
// to open with their signature bit.
const KEYED_EXCHANGES: Partial<Record<OfficeCharacterName, Exchange>> = {
  aria:  ['that’s what she said.', '...there it is.'],
  milo:  ['the spec is unambiguous.', 'nobody reads the spec, Milo.'],
  bo:    ['why few word when lot word?', '...just use the words, Bo.'],
  mia:   ['okay don’t freak out, but—', 'I’m already freaking out.'],
  noor:  ['well, actually—', '...here we go.'],
  iris:  ['this table is filthy.', 'it’s a break room, Iris.'],
  rex:   ['which one are you again?', '...we sit next to each other.'],
  caleb: ['is it snack day?', 'no, Caleb.', '...did I stutter?'],
  theo:  ['I went to that conference.', 'nobody cares.', '...I went to that conference.'],
  rowan: ['question.', 'yes.', 'nothing. just checking.'],
};

/** A multi-beat exchange for two agents sharing a table. Beats alternate:
 *  index 0 = `speaker`, 1 = the table-mate, 2 = speaker, … */
export function pickExchange(speaker: OfficeCharacterName, seed: number): Exchange {
  const keyed = KEYED_EXCHANGES[speaker];
  if (keyed && seed % 4 === 0) return keyed;
  return pick(PAIR_POOL, seed);
}
