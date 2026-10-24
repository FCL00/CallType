---
name: design-taste-frontend
description: >-
  tasteskill v2, the anti-slop frontend skill. Art direction for websites, distilled from a study of
  247 curated gallery sites (One Page Love, Awwwards Sites of the Day). Deals researched directions
  (idea, composition, type, palette, photographs, section blueprints) from a library, enforces a strict
  no-slop house style with a real-browser inspector, and runs a look-and-fix loop on screenshots. Use
  this whenever you build, design, redesign, restyle, polish or review a landing page, marketing site,
  portfolio, product page, one-pager, hero or any public-facing web page, in any stack (HTML/CSS, React,
  Next.js, Vue, Svelte, Astro, Tailwind) — also when the user says a page looks generic, templated,
  "AI-made", sloppy, or asks to make it look designed, premium, award-level or less like every other
  site. Also for app screens: dashboards, admin and analytics views, settings, inboxes and other screens
  people work in, with their own run and rules.
---

# tasteskill v2

A page built by a model usually looks like the average of every page the model has seen: a centred
headline over three lines, a little label above it, a row of icon cards, a soft gradient, a few thin
rules and a monospace caption. Nothing in it is wrong and nothing in it was decided.

This skill replaces those defaults with decisions, in four ways:

1. **A script deals the directions, you choose among them.** Asked to invent a look, a model picks
   the category default every time. `scripts/draw.mjs` deals three of twenty researched directions;
   you choose the one that carries the subject's idea, and the script then deals its type system,
   palette, hero and section compositions from a library distilled from 247 real sites.
2. **The idea comes from the subject.** In the study, what separated the best sites from the forgettable
   ones was a concept taken from the thing itself, not the styling.
3. **A house style with no ornaments,** measured in a real browser by `scripts/inspect.mjs`, so the
   rules are checked rather than hoped for.
4. **You look at what you made.** Screenshots at three widths, a juror's rubric, fix, look again.

One warning learned in testing. Taking the ornaments away is only half the job; a page that has lost its
labels, rules and cards and gained nothing in their place reads as thin, and blind jurors rightly prefer
a richer page with tells over an empty page without them. The other half is substance: type set
larger, whole fields of colour, real pictures of this subject's world (found or drawn), and every
section carrying its full content. The skill is built to give you that; do not trade it for restraint.

In the commands below `<skill>` is this skill's folder. Run them from the project's root, so the
working files land in `.taste-skill/` there. The scripts need Node 22+ and an installed Chrome, Edge
or Chromium, and install nothing. `assets.mjs` also needs network access; it uses no API keys.

## Page or app screen

Decide first which of two kinds of work this is.

- **A page** is read and scrolled: a landing page, a marketing or product site, a portfolio, an
  event, a restaurant, a one-pager. It follows **the run** below.
- **An app screen** is worked in: a dashboard, an admin or analytics view, settings, billing, an inbox
  or queue to work through, a wallet, a list with filters, an editor or builder. It follows
  **`references/app-screens.md`**: its own run, its own draw (`draw.mjs --app`), its own house rules
  (quiet borders, small labels and repeated panels are normal there; gradients, glows, icons in tinted
  squares, rainbow charts and invented vanity numbers are not) and `inspect.mjs --app`. Read that file
  whole before you start; the page run below does not apply.

A product site that shows its app is a page; the interface fragments on it follow the app-screen
rules for their insides. Deal the product's app style once, in its own folder, with the page's colours
and type kept:

```bash
node <skill>/scripts/draw.mjs --app --kind <kind> --brief "<the product>" --keep palette,type --out .taste-skill/app
```

and build every fragment the page shows (the hero's live screen, a feature's crop, a chart) as a real
piece of that app: `assets/app.css` for its panels, tables and controls, `assets/charts.js` for its
charts, real data that adds up, one finding stated, cropped and scaled the way the page's blueprint
treats a picture. A fragment that looks like a working product is the strongest picture a software page
has; grey bars and lorem numbers are the weakest. When a request mixes both (a landing page and the
dashboard behind it), build each with its own run and one shared palette and typeface.

## The run

Do these in order. Steps 1–5 take a few minutes and decide whether the page is any good.

### 1. Read the brief and the project

Find out what is real: the subject, the audience, the one thing the page must get someone to do, the
stack, any existing brand (colours, fonts, logo), and above all **what imagery truly exists**: the
project's own photographs or product shots, a real interface that can be shown, an image generation
tool you can call, or nothing. Do not plan around pictures you do not have. Nothing of its own is
rarely nothing at all: the subject's city, street, materials and history are in open archives and
museums, free to use with a credit (step 6, `scripts/assets.mjs`).

If the request is vague, decide and state your reading in one line instead of asking. Ask only when a
missing fact blocks the work (for example, no product name).

Then **inventory the subject** in your notes: eight to twelve things that belong to this client and to
no competitor. Look for its name and what the name means; its address, door number, street and
neighbourhood, and what that place looks like (its tiles, signs, paint colours, typefaces on its shop
fronts, its light, its weather); the numbers in the brief (seats, rooms, minutes to the sea, the
price, the year); the constraint it lives with (only one batch a month, closed in winter, by
appointment); its materials and colours; its rituals and hours (the oven lit at five, the ferry at
seven); the printed things of its world (a timetable, a label, a ticket, a sign). This list is where
the idea comes from in step 4. In blind tests, the page that won each brief was built from an item on
such a list (the client's name and what it means, the street it stands in, the one constraint that
makes it what it is), and the pages that lost had a good composition with a category idea. The list
is also your picture search: each place, material and printed thing on it is a query for step 6.

### 2. Write the argument

Before any design, list the page as claims with their proof, one line per section, the way
`references/copy.md` §1 shows. The claims decide which sections exist and in what order. Delete any
section that has no claim. This is how you avoid the stock sequence of hero, logos, three features,
testimonial, pricing, call to action.

### 3. Draw the direction

```bash
node <skill>/scripts/draw.mjs --sector <sector> --brief "<one line about the subject>" \
  --sections <roles in the order of your argument> [--tone <tone>] [--have <assets>] [--keep palette,type] \
  --options 3
```

This deals three directions and prints a short summary of each. Hold each one against your inventory:
which way of composing can carry something only this client has? Choose that one, not the most
familiar, and write one line in your notes on why. In testing, a single random direction that did not
suit the subject was the commonest cause of a weak page. Then deal the full sheet:

```bash
node <skill>/scripts/draw.mjs <the same arguments, without --options> --direction <chosen id>
```

- `--sector`: `node <skill>/scripts/draw.mjs --list sectors`. Pick the closest.
- `--sections`: roles from `--list roles` (features, showcase, how-it-works, testimonial, proof, stats,
  pricing, faq, cta, footer, intro, about, work, gallery, list, contact). The hero is implied.
- `--tone` (optional): quiet, bold, warm, technical, playful, luxury, editorial. Only pass it when the
  brief clearly asks for one.
- `--have`: assets that really exist, comma-separated: `photography` (the project's own photographs of
  the place, people or work), `product-photo` (photographs of the specific product, or an image tool
  that can make them), `product-ui` (real screenshots), `illustration`, `video`. Leave it out if you
  have none: the draw then avoids compositions that depend on them and the sheet says how to fill
  picture slots honestly (software shows its own interface built in HTML; a product with no photographs
  is drawn and set among real pictures of its world, never a fake product shot). Pictures you will
  find in the open collections are not the project's own; leave them out of `--have`.
- `--keep palette,type`: when the brand already fixes colours or typefaces. The draw then deals only
  the composition, and you map the brand's values onto the roles.

The command prints a **direction sheet**. It is the art direction for this build:

- **Adopt it.** Do not blend it with the layout you would have made anyway. If it feels unfamiliar,
  good: the familiar layout is the one this skill exists to prevent.
- Redraw one slot (`--redraw hero | type | palette | photos | scenes | section:<role> | direction`) only for a
  reason you can state: it contradicts a stated brand constraint, or needs an asset that does not
  exist. Never redraw to get something more comfortable. Record every redraw in your report.
- When a dealt section cannot hold the real content (it compares three plans and there is one price;
  it wants five quotations and there are none), do not bend the content to fit. List the others with
  `--alternatives <role>`, pick the one whose assumptions match the content, and take it with
  `--redraw section:<role>=<id>`.
- **Check the palette against the subject.** A dealt palette is a set of proportions (one ground, one
  ink, one accent, fields) as much as a set of colours. If its colours fight the subject's own material
  (candy pastels for a peat whisky, neon for a mountain hut), redraw the palette once; if the subject
  has unmistakable colours of its own (its material, the paint of its street, the landscape outside
  its windows), keep the dealt proportions and take the colours from the subject instead, and say so
  in the report.
- Reprint it any time with `node <skill>/scripts/draw.mjs --show`. In a long session, re-read it before each
  section you build.

### 4. Find the idea

The direction is a way of composing. The idea is what makes the page belong to this subject and no
other. Write this sentence in your notes and do not start building until both blanks are filled from
the subject itself:

> On this page, **[something that belongs to the subject]** becomes **[the device the direction calls for]**.

Places to look for the first blank:

- **Its output.** What does the thing produce? Put the real output on the page as material. (A camera
  that prints poems delivered its copy as paper slips.)
- **Its object or shape.** What does it physically look like, in cross-section, in silhouette?
  Enlarge it, crop it, make it the frame or the one motif.
- **Its name.** Can the letters hold a photograph, stack into a wall, split to two corners?
- **Its place.** Is there one view that makes someone want to be there?
- **Its ritual.** Is there a sequence the page can perform as it scrolls?
- **Its artefact.** What printed thing already exists in its world: ticket, menu, label, receipt,
  invitation, folder, manual?
- **Its opposite.** Which other category owns the feeling this one lacks?

Fill the first blank from your inventory (step 1), not from the category. **The competitor test:** put
the nearest real competitor in the sentence (the bakery two streets away, another oak furniture maker,
another hut on the same mountain). If the sentence still works, the idea belongs to the category: a
loaf of bread is every bakery; the seven doors of the street this one is named after are only this one.
"Clean and modern" is not an idea. The sites the study's panel scored lowest were the ones whose idea
was recorded as "none beyond the standard formula".

**One live thing.** Give the page one thing the visitor can do, or that is different for each visit,
made from the idea: pick a wood and see the chair in it; type your name and see it cut in the
foundry's letters; set the loan and read the real monthly figure; see whether the hut's stove is lit
right now and how long until the last ferry; choose a size and see it against the room. In blind tests every winning page had one and the jurors named it first. Rules: it uses the subject's real content, it works on a phone with a thumb, it has a plain
fallback without script, it never blocks reading, and it is one thing, not a playground. It is
built in step 6 as part of the page, not added as motion in step 9.

**The scenes carry the idea too.** The scroll scenes on the sheet are devices waiting for a subject.
Decide what each one shows from your inventory before building: the fly-through passes through this
studio's own title cards, the route is the road this shipment really takes, the picture that opens to
the whole screen is the room the guest will wake up in. A scene filled with pictures that could belong
to anyone is a screensaver.

### 5. Write the words

Write the whole page as a copy deck (plain text) before markup, following `references/copy.md`:

- **Every headline fits in two lines or fewer at every width.** Do the arithmetic in copy.md §2 before
  committing to a sentence: about 32 characters is safe everywhere at a confident size. The studied
  gallery heroes have a median of 5 words and 32 characters.
- One supporting sentence, directly under the headline (32–48px below it) and shown with it, never
  docked at the foot of the first screen or held back by an animation. When the headline is a name or
  a figure of speech, this sentence says plainly what the thing is. One primary action, named for what
  it does, as a real button on the first screen.
- **The first screen answers the visitor's first question in large type.** For an event: what it is,
  when and where (the dates belong in the headline or at the second size, never only in small text).
  For a product: what it is and what it costs or does. For a person: who and what they do. Every
  section the visitor came for (the line-up, the menu, the rooms, the price) has its own heading and
  its own place in the navigation.
- **Write the full content.** Every section the brief asks for delivers its information completely:
  the whole menu with prices, each room with its own details, every speaker and talk, the price with
  what it includes, an answer for each real question. Thin sections are the commonest reason a clean
  page loses to a busier one.
- Sample details are expected where the brief leaves gaps (dish names, room names and rates, project
  titles) so the design is seen at full density; list them in the report for the client to confirm.
  Proof is never invented: no customers, quotes, reviews, press, logos or business statistics.

### 6. Build it, still

Build the page with motion switched off in your head; a page that needs animation to look finished is
not finished. Order of work:

1. **Tokens.** Colour and type roles from the sheet as CSS custom properties. Everything downstream
   references tokens only. `<skill>/assets/base.css` is a neutral foundation you may start from (reset, token
   names, fluid type steps, grid, focus and selection styles, the motion helpers); it has no look of
   its own.
2. **The hero, exactly as the blueprint describes it,** at desktop and at phone width. Get the big
   thing big and the small things small before anything else exists.
3. **Each section from its blueprint,** with this project's content. Keep the geometry, change the
   subject. Neighbouring sections must not share a layout. **Carry the idea into every section,**
   pricing, FAQ and footer included: the commonest failure in the study, even among good sites, is a
   distinctive first screen followed by stock blocks.
4. **Imagery,** in this order of preference:
   1. the project's own;
   2. generated, if you have an image tool;
   3. **real pictures of the subject's world from the open collections,** whenever an honest one
      exists. Search them with `node <skill>/scripts/assets.mjs "<query>"` (Openverse, Wikimedia
      Commons, the Art Institute of Chicago and the Met; only licences that allow commercial use, by
      default). Search the inventory, not the category: its street in old postcards, an old map of the
      neighbourhood, its material up close, its trade in engravings, a museum object of its kind, a
      botanical plate, a star chart. Use them large and with intent: one archival photograph as the
      hero, an engraving enlarged into the page's motif, the real map of the street as the contact
      section. Look at each before choosing; `--get <ref>` downloads it into `assets/` and records
      its source and licence, and `--credits` prints the credit line for the footer. A found picture
      shows the world around the client and is never presented as the client's own product, room,
      dish, person or team;
   4. **drawn in code from the subject itself,** for what no honest picture exists of (its objects,
      its tiles, its windows, its product's interface, made as one consistent flat graphic language in
      the palette's real colours);
   5. the photographs dealt on the sheet, only where an honestly generic picture fits (the sea for a
      sea house), never as a stand-in for the subject;
   6. type and colour alone.

   When the project has footage or a real picture of its own process or product, the first screen
   shows it, large (about 40% of the screen or more). Never write a sentence on the page about where
   the pictures come from or what they are not ("none of these shows our bar"): a caption says what
   the picture is, and the credit line sits small in the footer. A portfolio whose work is invented
   for the brief draws each piece as a finished still of that work (its title card with its own type,
   an end frame, a poster), with real detail, never as a pictogram of the client's product.

   **The floor, which the inspector checks:** at least four real pictures on the page, usually six to
   twelve (photographs, archival images, maps, engravings, footage, raster artwork; for software, its
   cropped interface fragments count too). SVG drawings do not count toward the floor: draw what no
   picture exists of, and still carry real pictures. Add one moving picture wherever an honest clip
   exists: search it with `assets.mjs --video "<query>"` and use it as a muted loop with a poster
   frame. Models skip pictures and footage because finding them is work; the page fails without them.

   `references/imagery.md` covers searching, licences and credits, video, drawing, crops and treatments.
5. **The live thing** from step 4, built into the section where it proves the claim (often the hero
   or the booking), with real content, a thumb-sized phone version and a plain fallback.
6. **The scroll scenes,** when the sheet deals them (section 9), each with the section it carries: the page's big
   moments, the camera that flies through the work, the picture that opens to the whole screen, the
   word that buckles under the scroll. Copy the shared stage and the scene's files from
   `<skill>/assets/scenes/`, fill the scene with this project's own pictures and words, and set the
   page's tokens so it takes the page's look. A scene is composition: it decides how long the page is
   and what each screen shows, so it is built now and seen in every look round, not added at the end.
   `references/scenes.md` says how to put one on a page, fill it, fit it and ch
