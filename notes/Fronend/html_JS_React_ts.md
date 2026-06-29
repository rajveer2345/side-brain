# Frontend Interview Prep — HTML/CSS, JavaScript, React & TypeScript

> A complete, self-contained study guide. Each answer starts with a plain-English intuition, then the precise technical explanation, a commented example, and a visual where it helps — so you can both understand it and speak to it in an interview.

## Table of Contents

- [Section 1 — HTML & CSS](#section-1--html--css)
- [Section 2 — JavaScript](#section-2--javascript)
- [Section 3 — React](#section-3--react)
- [Section 4 — TypeScript](#section-4--typescript)

---

# Section 1 — HTML & CSS

## HTML

### 1. What is semantic HTML and why does it matter?

**Plain-English intuition:** Imagine you hand someone a book where every chapter, heading, and footnote is written in the exact same plain font with no labels. They could still read it, but they'd have to *guess* what each part is. Semantic HTML is like adding those labels back — it tells everyone reading the page (browsers, screen readers, search engines) "this part is the navigation," "this is the main article," "this is the footer." The label describes the **role** of the content, not how it looks.

**Technical explanation:** Semantic HTML means choosing tags based on the *meaning* of the content rather than its appearance. Instead of generic containers like `<div>` and `<span>` (which mean nothing), you use elements that carry built-in meaning:

| Tag | Meaning |
|---|---|
| `<header>` | Top section / intro of page or section |
| `<nav>` | Block of navigation links |
| `<main>` | The dominant, unique content of the page |
| `<article>` | A self-contained piece (blog post, comment) |
| `<section>` | A thematic grouping of content |
| `<aside>` | Side content (sidebars, related links) |
| `<footer>` | Bottom info (copyright, links) |
| `<figure>` / `<figcaption>` | An image/diagram with a caption |
| `<time>` | A machine-readable date/time |

**Why it matters:**
- **Accessibility** — Screen readers build a navigable outline from these tags. A blind user can press one key to jump straight to `<main>` or list all `<nav>` regions. With `<div>`s, none of that works.
- **SEO** — Search engines weight content inside `<article>` and `<main>` differently from boilerplate, improving how your page is indexed.
- **Maintainability** — `<article>` instantly tells the next developer what it is; `<div class="article">` requires reading the CSS to find out.

```html
<!-- ❌ Non-semantic: everything is a featureless box -->
<div class="header"></div>
<div class="nav"></div>
<div class="main-content"></div>

<!-- ✅ Semantic: each tag announces its purpose -->
<header>...</header>   <!-- screen reader: "banner region" -->
<nav>...</nav>         <!-- screen reader: "navigation region" -->
<main>...</main>       <!-- screen reader: "main region" -->
```
**Output / effect:** Both render identically on screen, but the semantic version exposes a rich, navigable structure to assistive tech and crawlers for free.

---

### 2. What is the difference between `<div>` and `<span>`?

**Plain-English intuition:** Think of a page like a paragraph of text. A `<div>` is like starting a brand-new paragraph — it pushes everything after it onto a new line and stretches across the whole page. A `<span>` is like highlighting a single word *inside* a sentence — it stays right where it is in the flow of words and only wraps the few characters it contains.

**Technical explanation:** Both are "generic" containers with no built-in meaning — they exist purely for grouping and styling. The difference is their default `display`:

| | `<div>` | `<span>` |
|---|---|---|
| Default display | `block` | `inline` |
| Starts a new line? | Yes | No |
| Width | Full width of parent | Only as wide as its content |
| Respects width/height? | Yes | No |
| Typical use | Group big sections/layout | Style a snippet of text |

```html
<div>Block one</div>
<div>Block two</div>
<!-- Renders stacked vertically:
     Block one
     Block two            -->

<p>The word <span style="color:red">apple</span> is highlighted.</p>
<!-- Renders on one line:
     The word apple is highlighted   ("apple" in red, no line break) -->
```

**Gotcha:** You *can* put a block element inside a `<div>`, but putting a `<div>` inside a `<span>` is invalid HTML — inline elements shouldn't contain block elements.

---

### 3. Block vs inline vs inline-block elements

**Plain-English intuition:** Picture stacking moving boxes. **Block** elements are full-size boxes that each demand their own row — you can't put anything beside them. **Inline** elements are like words in a sentence — they sit side by side and only take the space they need, and you can't force them to be a specific size. **Inline-block** is the best of both: it sits side by side like a word, but you *can* set its exact width and height like a box.

**Technical comparison:**

| Behavior | block | inline | inline-block |
|---|:---:|:---:|:---:|
| Starts new line | ✅ | ❌ | ❌ |
| Sits beside others | ❌ | ✅ | ✅ |
| Respects `width`/`height` | ✅ | ❌ | ✅ |
| Respects vertical margin/padding (pushes layout) | ✅ | ❌ (visual padding leaks but doesn't push) | ✅ |
| Examples | `div`, `p`, `h1`, `section` | `span`, `a`, `strong`, `em` | `img`, buttons styled inline-block |

```css
.tag {
  display: inline-block;  /* flows in a line like text... */
  width: 80px;            /* ...but width/height now actually apply */
  height: 30px;
  margin: 4px;            /* and margins push other tags away */
}
```
```
block:         [=========== full width ===========]
               [=========== full width ===========]

inline:        word word word word word (wrap as text)

inline-block:  [box][box][box]  (sized boxes, side by side)
```

**Why it matters:** A classic bug is trying to set `width`/`height` on an inline `<a>` or `<span>` and seeing nothing happen — the fix is `display: inline-block` (or `block`).

---

### 4. What is the DOCTYPE declaration?

**Plain-English intuition:** The DOCTYPE is like flashing your ID at the door of a club. It tells the browser "I'm a modern HTML5 page, please use the modern, correct rulebook." If you forget it, the browser assumes you're an ancient page from the 1990s and switches into a bizarre "bug-compatibility" mode to keep old sites working — which breaks your modern layout in subtle ways.

**Technical explanation:** `<!DOCTYPE html>` must be the **very first line** of the document. It triggers **standards mode**, where the browser follows current W3C/WHATWG specifications. Omitting it (or using an old/malformed one) drops the browser into **quirks mode**, which emulates legacy 1990s behavior — most famously, the old broken box model where `width` mistakenly included padding and border.

```html
<!DOCTYPE html>   <!-- must be line 1; tells browser: use HTML5 standards mode -->
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

| Mode | Triggered by | Box model | CSS behavior |
|---|---|---|---|
| Standards | `<!DOCTYPE html>` present | Correct (modern) | Spec-compliant |
| Quirks | DOCTYPE missing/old | Legacy/broken | Emulates old browser bugs |

**Note:** It is *not* an HTML tag and has no closing tag — it's a one-time instruction to the parser.

---

### 5. Difference between `id` and `class`

**Plain-English intuition:** An `id` is like a person's passport number — exactly one person has it, and it uniquely identifies them. A `class` is like a job title such as "student" — many people can share it, and you use it to refer to the whole group at once.

**Technical comparison:**

| | `id` | `class` |
|---|---|---|
| How many per page | Unique (one element only) | Reusable (many elements) |
| CSS selector | `#header` | `.card` |
| Specificity | Higher (0,1,0,0) | Lower (0,0,1,0) |
| JS access | `getElementById('x')` | `getElementsByClassName('x')` / `querySelectorAll('.x')` |
| URL anchor target | `<a href="#section">` jumps to `id="section"` | Not used for anchors |

```html
<nav id="main-nav" class="bar dark">...</nav>
<!-- one unique id, plus two shared classes applied together -->
```
```css
#main-nav { position: sticky; }  /* targets the single unique element */
.bar      { padding: 10px; }     /* targets EVERY element with class "bar" */
```

**Rule of thumb:** Use **classes** for styling (reusable, low specificity = easy to override) and reserve **ids** for unique JS hooks or anchor links. Over-using ids in CSS creates specificity wars that are hard to undo.

---

### 6. What are data attributes?

**Plain-English intuition:** Sometimes you want to "tape a sticky note" onto an HTML element holding extra info — like which user a button belongs to — without that info showing up on screen. `data-*` attributes are those invisible sticky notes that your JavaScript can later read.

**Technical explanation:** Any attribute starting with `data-` is a valid custom attribute that stores private data on an element. It doesn't affect rendering. In JavaScript you read them through the `.dataset` property, where the names are automatically converted from `kebab-case` to `camelCase`.

```html
<button data-user-id="42" data-role="admin">Edit</button>
```
```js
const btn = document.querySelector('button');
btn.dataset.userId;  // "42"     (data-user-id  →  userId)
btn.dataset.role;    // "admin"  (data-role     →  role)

btn.dataset.role = "guest";       // updates the attribute in the DOM
// You can also read in CSS:  button[data-role="admin"] { color: gold; }
```
**Output:** The button looks normal on screen, but carries `42` and `admin` as queryable metadata.

**Why it matters:** It's the clean, standards-based way to pass server data to client-side JS without abusing `class` names or hidden inputs. Note: values are always strings (`"42"`, not `42`).

---

### 7. Difference between `<script>`, `<script async>`, and `<script defer>`

**Plain-English intuition:** Imagine the browser is reading your HTML top-to-bottom like a person reading a recipe. A plain `<script>` is like stopping mid-recipe to drive to the store and back before continuing — everything halts. `async` is like sending a helper to fetch an ingredient while you keep cooking, but the *instant* they return you drop everything to use it. `defer` is like writing the ingredient on a list and only dealing with it *after* you've finished reading the whole recipe — and in the order you listed them.

**Technical explanation:**

| | Download | When it runs | Blocks HTML parsing? | Order preserved? |
|---|---|---|---|---|
| `<script>` | Immediately, blocking | Immediately when fetched | ✅ Yes (bad for perf) | ✅ Yes |
| `<script async>` | In parallel | As soon as it's ready | Pauses only to execute | ❌ No (whichever finishes first) |
| `<script defer>` | In parallel | After HTML fully parsed | ❌ No | ✅ Yes (document order) |

```
PARSING TIMELINE  (━ = parse HTML, ▓ = download JS, █ = execute JS)

plain:    ━━━━━[▓▓▓██]━━━━━━━     (parsing freezes during fetch+run)
async:    ━━━━━━━━━━━━━━━━        (parse continues)
              ▓▓▓██               (runs the moment it lands — interrupts)
defer:    ━━━━━━━━━━━━━━━|██       (parse fully finishes, THEN runs in order)
              ▓▓▓
```

```html
<script src="analytics.js" async></script>  <!-- independent, order doesn't matter -->
<script src="lib.js"    defer></script>      <!-- needs DOM; runs first -->
<script src="app.js"    defer></script>      <!-- needs DOM + lib.js; runs second -->
```

**Rule of thumb:** Use **`defer`** for scripts that touch the DOM or depend on each other (most app code). Use **`async`** for fully independent third-party scripts like analytics. Avoid plain blocking `<script>` in `<head>`.

---

### 8. What is the difference between `localStorage`, `sessionStorage`, and cookies?

**Plain-English intuition:** Think of three places to keep notes. **localStorage** is a permanent drawer in your desk — notes stay until you throw them out. **sessionStorage** is a sticky note on your monitor that gets tossed the moment you close that browser tab. **Cookies** are tiny notes you staple to *every letter* you mail to the server — small, but the server always sees them.

**Technical comparison:**

| Feature | localStorage | sessionStorage | Cookies |
|---|---|---|---|
| Capacity | ~5–10 MB | ~5 MB | ~4 KB |
| Expiry | Never (until cleared) | When the tab closes | Set manually (or session) |
| Sent to server | ❌ No | ❌ No | ✅ Yes, on every HTTP request |
| Accessible by | JS only | JS only | JS **and** server |
| Scope | Per origin, all tabs | Per origin, single tab | Per origin (+ path/domain rules) |

```js
// localStorage — survives browser restarts
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');          // "dark"  (even after closing browser)

// sessionStorage — gone when this tab closes
sessionStorage.setItem('step', '2');

// cookie — string format; auto-sent to server on requests
document.cookie = "token=abc123; max-age=3600; path=/";
```

**Rule of thumb:**
- **Cookies** → data the *server* needs every request (auth/session tokens). Keep them small; mark them `HttpOnly` + `Secure` for security.
- **localStorage** → persistent client-only data (theme, draft text, cached settings).
- **sessionStorage** → temporary per-tab state (multi-step form progress).

---

### 9. What are `meta` tags? Name important ones.

**Plain-English intuition:** `<meta>` tags are the "label on the box" — they don't show up *inside* the page, but they tell the browser and outside services important facts about it: what character set to use, how to scale on phones, and what to show in a Google search result.

**Technical explanation:** `<meta>` tags live in the `<head>` and provide metadata (data about the document). They're invisible to users but read by browsers, search engines, and social-media crawlers.

```html
<head>
  <meta charset="UTF-8">
  <!-- defines text encoding so é, ñ, emoji render correctly. Put it first. -->

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- responsive: match the page width to the device width, no zoom-out -->

  <meta name="description" content="A short summary of the page">
  <!-- often used as the snippet under your link in Google results (SEO) -->

  <meta property="og:title" content="My Page">
  <!-- Open Graph: controls the title shown when shared on social media -->
</head>
```

**Why the viewport tag is critical:** Without it, a mobile browser pretends it's a ~980px-wide desktop and shrinks the whole page to fit — your text becomes microscopic and media queries don't behave. The viewport tag tells mobile to use its *real* width, which is the foundation of responsive design.

---

### 10. What is the difference between `<b>`/`<i>` and `<strong>`/`<em>`?

**Plain-English intuition:** `<b>` and `<i>` are like changing the *ink* — purely visual, "make this bold/italic," with no message about *why*. `<strong>` and `<em>` change the *tone of voice* — they mean "this is important" or "stress this word," which a screen reader will actually convey by reading it differently.

**Technical comparison:**

| Tag | Renders as | Carries meaning? | Screen reader effect |
|---|---|---|---|
| `<b>` | **Bold** | No (stylistic only) | Read normally |
| `<i>` | *Italic* | No (stylistic only) | Read normally |
| `<strong>` | **Bold** | Yes — strong importance | May change emphasis/tone |
| `<em>` | *Italic* | Yes — emphasis/stress | Often vocally stressed |

```html
<p>Warning: <strong>do not</strong> share your password.</p>
<!-- "do not" is announced as important by assistive tech -->

<p>The word <i>karma</i> comes from Sanskrit.</p>
<!-- italic is purely typographic convention here, no importance implied -->
```

**Rule of thumb:** Default to the semantic versions (`<strong>`/`<em>`) when the styling reflects actual importance or emphasis. Reserve `<b>`/`<i>` for purely typographic conventions (keywords, foreign words, ship names) where no extra meaning is intended.

---

## CSS

### 11. What is the CSS Box Model?

**Plain-English intuition:** Every element on a page is wrapped like a framed picture on a wall. The **content** is the photo itself. The **padding** is the matting between the photo and the frame. The **border** is the frame. The **margin** is the empty wall space you leave between this frame and the next one. Understanding these four layers explains almost every "why is there a gap / why is this too big" question in CSS.

**Technical explanation:** Every element is a rectangular box made of four layers, from the inside out: **Content → Padding → Border → Margin**.

```
+---------------------------------------+
|                MARGIN                 |   <- transparent space OUTSIDE, pushes neighbors away
|   +-------------------------------+   |
|   |            BORDER             |   |   <- the visible edge/frame
|   |   +-----------------------+   |   |
|   |   |        PADDING        |   |   |   <- space INSIDE the border, around content
|   |   |   +---------------+   |   |   |
|   |   |   |   CONTENT     |   |   |   |   <- text / image (width × height)
|   |   |   +---------------+   |   |   |
|   |   +-----------------------+   |   |
|   +-------------------------------+   |
+---------------------------------------+
```

| Layer | What it is | Can it have color? | Counted in clickable area? |
|---|---|---|---|
| Content | The actual text/image | n/a | ✅ |
| Padding | Inner breathing room | Takes background color | ✅ |
| Border | The edge line | Yes (border color) | ✅ |
| Margin | Outer gap | Always transparent | ❌ |

```css
.box {
  width: 200px;     /* content width (in default content-box) */
  padding: 20px;    /* 20px of space inside, around the content */
  border: 5px solid;/* 5px frame */
  margin: 10px;     /* 10px gap to neighbors */
}
/* Default total rendered width = 200 + 20*2 + 5*2 = 250px (see Q12) */
```

---

### 12. `box-sizing: border-box` vs `content-box`

**Plain-English intuition:** When you say a box is "200px wide," what counts? With `content-box` (the default), 200px is just the *photo*, and the matting and frame get added *on top* — so the thing you hung on the wall is actually bigger than 200px and might not fit. With `border-box`, 200px is the *whole framed picture* — padding and border are squeezed *inside* that 200px, so it always fits exactly where you planned.

**Technical explanation:**

| | `content-box` (default) | `border-box` |
|---|---|---|
| `width` applies to | content only | content + padding + border |
| Padding/border... | **added** to width | **included** in width |
| Predictable? | No (math surprises) | Yes |

```css
.a { box-sizing: content-box; width: 200px; padding: 20px; border: 5px solid; }
/* Real width = 200 + 20 + 20 + 5 + 5 = 250px  ❗ bigger than you asked */

.b { box-sizing: border-box;  width: 200px; padding: 20px; border: 5px solid; }
/* Real width = 200px exactly; content shrinks to 150px to make room  ✅ */
```
```
content-box:  |<-pad->|<--- 200px content --->|<-pad->|   total 250px
border-box:   |<-pad->|<-- 150px content -->|<-pad->|     total 200px
              |<----------- 200px (as declared) ----------->|
```

**Best practice:** Almost every project resets this globally so sizing is intuitive:
```css
*, *::before, *::after { box-sizing: border-box; }
```

---

### 13. Difference between `position` values

**Plain-English intuition:** `position` controls how an element is placed and what `top/left/right/bottom` mean. Think of it as: *static* = "go with the flow, sit where you naturally land." *relative* = "shift slightly from your natural spot, but keep your seat." *absolute* = "leave your seat entirely and pin yourself somewhere relative to a parent." *fixed* = "pin yourself to the screen glass, ignore scrolling." *sticky* = "act normal until you hit the edge, then stick there."

**Technical comparison:**

| Value | In normal flow? | `top/left` relative to | Scrolls away? |
|---|---|---|---|
| `static` | Yes | (ignored) | Yes |
| `relative` | Yes (keeps its space) | its own original position | Yes |
| `absolute` | No (removed) | nearest *positioned* ancestor | Yes (with that ancestor) |
| `fixed` | No (removed) | the viewport (screen) | ❌ No (stays put) |
| `sticky` | Yes, then pins | scroll container | Until threshold, then sticks |

```css
.relative { position: relative; top: 10px; }
/* nudged 10px down, but still occupies its original slot */

.modal { position: absolute; top: 0; left: 0; }
/* pinned to top-left of nearest ancestor with position != static */

.navbar { position: fixed; top: 0; }
/* glued to top of screen, stays during scroll */

.header { position: sticky; top: 0; }
/* normal until it reaches the top, then sticks there */
```

**Key gotcha:** `absolute` searches *upward* for the nearest ancestor that is itself positioned (`relative`/`absolute`/`fixed`/`sticky`). If none exists, it positions against the page (`<html>`). This is why you often set `position: relative` on a parent to "contain" an absolute child.

---

### 14. Explain CSS specificity.

**Plain-English intuition:** When two CSS rules both try to style the same element, the browser needs a referee to decide who wins. Specificity is that referee's scoring system. Think of it like a four-digit score `(a, b, c, d)` where each kind of selector earns points in a different column, and you compare the scores left-to-right like a number.

**Technical explanation:** Specificity is scored as **(inline, IDs, classes, elements)**:

| Selector type | Example | Score |
|---|---|---|
| Inline style | `style="..."` | 1,0,0,0 |
| ID | `#nav` | 0,1,0,0 |
| Class / attribute / pseudo-class | `.btn`, `[type]`, `:hover` | 0,0,1,0 |
| Element / pseudo-element | `div`, `::before` | 0,0,0,1 |
| Universal `*`, combinators | `*`, `>`, `+` | 0,0,0,0 |

You compare column by column, left to right. A single ID (0,1,0,0) beats *any* number of classes (e.g. 0,0,5,0), because the ID column is more significant.

```css
#sidebar .link  { color: red; }   /* 0,1,1,0 */
.menu .link     { color: blue; }  /* 0,0,2,0 */
/* Result: RED wins — one ID outranks two classes */

a.link          { color: green; } /* 0,0,1,1 */
.link           { color: pink; }  /* 0,0,1,0 */
/* Result: GREEN wins — tie on classes, but green also has an element */
```

**Tie-breakers:** If specificity is exactly equal, the rule that appears **last** in the CSS wins. `!important` overrides normal specificity entirely (use sparingly — see Q27).

---

### 15. Difference between `em`, `rem`, `%`, `px`, `vw/vh`

**Plain-English intuition:** These are different rulers for measuring sizes. Some are *fixed* (an inch is always an inch — `px`). Others are *relative* — they measure against something else, like "half of my parent" or "1% of the screen." Relative units are what make designs scale gracefully across screen sizes and respect a user's font preferences.

**Technical comparison:**

| Unit | Relative to | Compounds when nested? | Best for |
|---|---|---|---|
| `px` | Nothing (absolute) | No | Fixed borders, hairlines |
| `em` | **Parent's** font-size | ✅ Yes (can snowball) | Spacing tied to local text size |
| `rem` | **Root** (`<html>`) font-size | No | Scalable typography & spacing |
| `%` | Parent's matching dimension | n/a | Fluid widths |
| `vw` / `vh` | 1% of viewport width / height | n/a | Full-screen sections, hero text |

```css
html { font-size: 16px; }            /* 1rem = 16px everywhere */

.parent { font-size: 20px; }
.child  { font-size: 2em; }          /* 2 × 20px (parent) = 40px */
.child2 { font-size: 2rem; }         /* 2 × 16px (root)   = 32px */

.hero   { height: 100vh; }           /* exactly the screen's height */
.col    { width: 50%; }              /* half the parent's width */
```

**The em "snowball" gotcha:**
```
<div font-size:2em>           -> 2 × 16 = 32px
   <div font-size:2em>        -> 2 × 32 = 64px   ❗ multiplies again
      <div font-size:2em>     -> 2 × 64 = 128px  ❗ keeps growing
```
With `rem`, all three would stay anchored to the root, avoiding surprises. **Rule of thumb:** prefer `rem` for font sizes and spacing; use `em` only when you *want* sizing relative to the local text.

---

### 16. Flexbox — explain the main concepts.

**Plain-English intuition:** Flexbox is a system for laying out items in a single line (a row or a column) and intelligently distributing space among them — like arranging books on one shelf, deciding the gaps between them and whether they stretch to fill the shelf. Everything hinges on two directions: the **main axis** (the direction items flow) and the **cross axis** (perpendicular to it).

**The two axes (the key mental model):**
```
flex-direction: row  →  main axis is horizontal ───►
  ┌───────────────────────────────────┐
  │ [item] [item] [item]              │  cross axis ↑↓ (vertical)
  └───────────────────────────────────┘
       justify-content = along main (horizontal)
       align-items     = along cross (vertical)

flex-direction: column  →  main axis is vertical
  swap them: justify-content now vertical, align-items now horizontal
```

```css
.container {
  display: flex;
  flex-direction: row;        /* main axis: row (default) | column */
  justify-content: center;    /* position items ALONG the main axis */
  align-items: center;        /* position items ALONG the cross axis */
  gap: 16px;                  /* consistent spacing between items */
  flex-wrap: wrap;            /* let items drop to a new line if cramped */
}
.item {
  flex: 1;                    /* grow / shrink / basis shorthand */
}
```

**Key properties:**
- **`justify-content`** (main axis): `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.
- **`align-items`** (cross axis): `stretch` (default), `center`, `flex-start`, `flex-end`, `baseline`.
- **`flex: 1`** expands to `flex-grow:1 flex-shrink:1 flex-basis:0` — every item grows to share leftover space equally.

```
justify-content: space-between
┌────────────────────────────────────────┐
│[A]            [B]            [C]        │
└────────────────────────────────────────┘
```

**Why it matters:** Flexbox makes vertical centering — historically painful in CSS — trivial: `display:flex; justify-content:center; align-items:center`.

---

### 17. CSS Grid vs Flexbox — when to use which?

**Plain-English intuition:** **Flexbox** is for arranging things along *one line* — like buttons in a toolbar or links in a nav. **Grid** is for *two-dimensional* layouts where you control rows *and* columns at the same time — like a spreadsheet or a photo gallery. A handy phrase: Flexbox is **content-first** (let items size themselves and flow), Grid is **layout-first** (define the structure, then drop content into it).

**Comparison:**

| | Flexbox | Grid |
|---|---|---|
| Dimensions | One (row OR column) | Two (rows AND columns) |
| Driven by | Content | Layout structure |
| Best for | Navbars, toolbars, button groups, centering | Page layouts, card galleries, dashboards |
| Alignment | Along one axis | Both axes, with named areas |

```css
/* Grid: two-dimensional structure */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 equal-width columns */
  gap: 16px;
}

/* Responsive grid that auto-fits as many columns as fit, min 200px each */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```
```
Flexbox (1D):  [nav] [nav] [nav] [nav]          one row

Grid (2D):     ┌─────┬─────┬─────┐
               │  A  │  B  │  C  │
               ├─────┼─────┼─────┤
               │  D  │  E  │  F  │
               └─────┴─────┴─────┘
```

**They're complementary, not rivals:** A common pattern is Grid for the overall page skeleton (header / sidebar / main / footer) and Flexbox for the small components living inside each cell.

---

### 18. How does `z-index` work?

**Plain-English intuition:** Imagine sheets of transparent paper stacked on a desk. `z-index` decides which sheet is on top when they overlap. A higher number floats nearer to you (the viewer); a lower number sits further back. But there's a twist — sheets are grouped into stacks, and a sheet can never rise above the *stack* it belongs to, no matter how high its own number is.

**Technical explanation:** `z-index` controls stacking order along the z-axis (toward/away from the viewer). Crucial rules:
1. It **only works on positioned elements** (`relative`, `absolute`, `fixed`, `sticky`) — a `static` element ignores it.
2. Higher value = closer to the front.
3. It is **scoped to a stacking context** — a child's `z-index` is only compared against siblings *within the same context*, never globally.

```css
.modal   { position: fixed;    z-index: 1000; }  /* on top of normal content */
.overlay { position: fixed;    z-index: 999;  }  /* just behind the modal */
.tooltip { position: absolute; z-index: 10;   }  /* z-index ignored if static! */
```

**The classic confusing bug:**
```
Parent A (z-index: 1)          Parent B (z-index: 2)
   └─ child (z-index: 9999)
```
The child with `z-index: 9999` STILL renders *below* Parent B. Why? Because the child is trapped inside Parent A's stacking context, and the whole of Parent A (z=1) sits behind Parent B (z=2). The 9999 only competes *inside* A. (See Q19 for what creates a context.)

---

### 19. What creates a new stacking context?

**Plain-English intuition:** A "stacking context" is like a sealed box of those transparent sheets from Q18. Once an element opens its own box, all its children's `z-index` values are confined inside that box — they can rearrange among themselves but the whole box moves as one unit relative to the outside world. Knowing what *opens* a box is the secret to solving "my z-index doesn't work!" bugs.

**Common triggers that create a new stacking context:**

| Trigger | Example |
|---|---|
| Positioned + `z-index` ≠ `auto` | `position: relative; z-index: 1;` |
| `opacity` less than 1 | `opacity: 0.99;` |
| Any `transform` | `transform: translateZ(0);` |
| Any `filter` | `filter: blur(0);` |
| `will-change` | `will-change: transform;` |
| `isolation: isolate` | the purpose-built, side-effect-free way |
| Fixed / sticky positioning | `position: fixed;` |

```css
.card {
  opacity: 0.95;     /* ❗ silently creates a stacking context */
  /* now any z-index inside .card is trapped relative to siblings of .card */
}

/* The clean, explicit way to create one on purpose: */
.layer { isolation: isolate; }
```

**Why it matters:** Properties like `opacity`, `transform`, and `filter` create contexts as a *side effect* — so adding a fade or a scale animation can mysteriously change which element appears on top. When `z-index` "won't go high enough," the real fix is usually finding the unintended stacking context an ancestor created.

---

### 20. How do you center a div?

**Plain-English intuition:** "Centering a div" is the most famous rite of passage in CSS. There are several reliable recipes; the modern ones (Flexbox and Grid) make it a one- or two-line job, both horizontally and vertically.

```css
/* ✅ Flexbox — the most common, works everywhere */
.parent {
  display: flex;
  justify-content: center;   /* center horizontally (main axis) */
  align-items: center;       /* center vertically (cross axis) */
}

/* ✅ Grid — the shortest of all */
.parent {
  display: grid;
  place-items: center;       /* centers on BOTH axes in one line */
}

/* ✅ Absolute + transform — when you can't use fl/grid on the parent */
.child {
  position: absolute;
  top: 50%;                  /* move top edge to vertical middle */
  left: 50%;                 /* move left edge to horizontal middle */
  transform: translate(-50%, -50%); /* pull back by half its own size to truly center */
}

/* ✅ Horizontal-only for a block with a known width */
.child { margin: 0 auto; width: 300px; }
```
```
parent (flex / grid):
┌───────────────────────┐
│                       │
│        [child]        │   <- centered both ways
│                       │
└───────────────────────┘
```

**Why `translate(-50%, -50%)`:** `top:50%`/`left:50%` aligns the child's *top-left corner* to the center, leaving it offset down-right. The `translate(-50%,-50%)` shifts it back by half its *own* width and height, landing the child's center exactly on the parent's center.

---

### 21. What is the difference between `visibility: hidden`, `display: none`, and `opacity: 0`?

**Plain-English intuition:** All three "hide" an element, but they differ in whether the element still takes up space and whether you can still click it. Think: `display:none` = the element *teleports away* (no space, gone). `visibility:hidden` = the element is *invisible but its chair is still reserved* (space kept, can't touch it). `opacity:0` = the element is *transparent glass* (space kept, and you can still click right through to it, and it can fade smoothly).

**Comparison:**

| Property | Takes up space? | Clickable / interactive? | Animatable (can fade)? |
|---|:---:|:---:|:---:|
| `display: none` | ❌ No (removed from layout) | ❌ No | ❌ No (it's instant) |
| `visibility: hidden` | ✅ Yes (gap remains) | ❌ No | ❌ No |
| `opacity: 0` | ✅ Yes | ✅ **Yes** (still catches clicks!) | ✅ Yes (transition-friendly) |

```css
.gone     { display: none; }       /* vanishes; layout collapses around it */
.invisible{ visibility: hidden; }  /* invisible but its space is held open */
.faded    { opacity: 0; transition: opacity .3s; } /* fade in/out smoothly */
```

**Gotcha:** `opacity: 0` elements are *still clickable* — a common bug where an invisible button intercepts clicks. To make it truly inert while keeping the fade, also add `pointer-events: none;`.

---

### 22. What are pseudo-classes vs pseudo-elements?

**Plain-English intuition:** A **pseudo-class** styles an element when it's in a certain *situation* — like "when the mouse is hovering" or "when it's the first child." A **pseudo-element** styles a *piece* of an element that isn't a real tag — like the first line of a paragraph, or lets you *insert* decorative content before/after it without adding HTML.

**Technical distinction:**

| | Pseudo-class | Pseudo-element |
|---|---|---|
| Syntax | single colon `:` | double colon `::` |
| Targets | a **state/condition** | a **part** or generated content |
| Examples | `:hover`, `:focus`, `:nth-child(2)`, `:first-child`, `:checked` | `::before`, `::after`, `::placeholder`, `::first-line`, `::selection` |

```css
/* Pseudo-class: styles a STATE of the whole element */
a:hover        { color: blue; }      /* only while hovered */
li:nth-child(odd) { background: #eee; } /* every odd list item */

/* Pseudo-element: styles a PART or injects content */
.card::before  { content: "★ "; }    /* inserts a star before the content */
p::first-line  { font-weight: bold; }/* styles just the first visual line */
input::placeholder { color: gray; }  /* styles the placeholder text */
```
**Output:** `a:hover` turns links blue *only* under the cursor; `.card::before` prepends a star that doesn't exist in the HTML at all.

**Gotcha:** `::before`/`::after` only render if they have a `content` property (even `content: ""`). Without it, nothing appears.

---

### 23. Responsive design and media queries (absolute vs relative units)

**Plain-English intuition:** Responsive design means one website that reshapes itself to look good on a phone, a tablet, and a desktop. **Media queries** are the "if the screen is this size, apply these styles" switches that make that happen. Pairing them with *relative* units (Q15) keeps text and spacing scaling proportionally instead of being locked to fixed pixels.

**Technical explanation:** A media query wraps CSS rules that only apply when the device matches a condition (usually screen width):

```css
/* Base styles apply to all sizes (mobile-first) */
.sidebar { display: block; }

@media (max-width: 768px) {        /* applies on tablets and SMALLER */
  .sidebar { display: none; }      /* hide sidebar on small screens */
}

@media (min-width: 1024px) {       /* applies on desktops and LARGER */
  .container { max-width: 1200px; }
}
```

**Mobile-first vs Desktop-first:**
```
Mobile-first  (recommended):  write small-screen base, ADD with min-width
   base ───► [min-width:768px] ───► [min-width:1024px]
   simple → progressively enhanced for bigger screens

Desktop-first:  write big-screen base, OVERRIDE with max-width
   base ───► [max-width:1024px] ───► [max-width:768px]
```

**Why relative units help:** Combine media queries with `rem`/`%`/`vw` so layouts flex *between* breakpoints too — not just snap at them. Mobile-first is generally preferred because base styles stay simple and you layer complexity only as screens grow.

---

### 24. What is margin collapse?

**Plain-English intuition:** When two stacked block elements each ask for vertical breathing room, CSS doesn't *add* their requests together — it just honors the *bigger* one, like two people each wanting personal space and the larger request covering both. This only happens in the vertical direction, and it surprises people constantly.

**Technical explanation:** When the **vertical** margins (top/bottom) of block-level boxes touch, they **collapse** into a single margin equal to the **larger** of the two — not their sum. Horizontal margins never collapse.

```css
.top    { margin-bottom: 30px; }
.bottom { margin-top: 20px; }
/* Gap between them is 30px (the larger), NOT 50px */
```
```
Expected (wrong):           Actual (collapsed):
┌──────────┐                ┌──────────┐
│  .top    │                │  .top    │
└──────────┘ ↕ 30           └──────────┘
             ↕ 20  = 50?    ↕ 30  (only the larger)
┌──────────┐                ┌──────────┐
│ .bottom  │                │ .bottom  │
└──────────┘                └──────────┘
```

**When it happens:**
- Between **adjacent siblings** (one's bottom margin meets the next's top margin).
- Between a **parent and its first/last child** (the child's margin can "leak out" through the parent).

**How to prevent it:** Add `padding` or a `border` between the margins, or make the container a **flex** or **grid** container (margins never collapse inside flex/grid). This is why parents with `display:flex` mysteriously "stop the leaking margin" bug.

---

### 25. What are CSS variables (custom properties)?

**Plain-English intuition:** CSS variables let you give a value a name once — like "the brand color is `--primary`" — and reuse that name everywhere. Change it in one place and everything updates. Unlike Sass variables (which are compiled away before the browser sees them), CSS variables are *alive in the browser*, so JavaScript can change them on the fly — perfect for things like a dark-mode toggle.

**Technical explanation:** Defined with a `--name` prefix and read with the `var()` function. They cascade and inherit like normal properties.

```css
:root {                     /* :root = the <html> element = global scope */
  --primary: #3498db;
  --gap: 16px;
}

.button {
  background: var(--primary);          /* reads the variable */
  padding: var(--gap);
  color: var(--text, white);           /* "white" = fallback if --text is unset */
}
```
```js
// Live at runtime — change the theme instantly with JS:
document.documentElement.style.setProperty('--primary', '#e74c3c');
// every element using var(--primary) recolors immediately — no rebuild needed
```

| | CSS variables | Sass/SCSS variables |
|---|---|---|
| Exist at runtime? | ✅ Yes (in the browser) | ❌ No (compiled away) |
| Changeable by JS? | ✅ Yes | ❌ No |
| Cascade / inherit? | ✅ Yes | ❌ No |

**Why it matters:** They're the foundation of modern theming (light/dark modes, white-labeling) without duplicating stylesheets.

---

### 26. How do CSS transitions and animations differ?

**Plain-English intuition:** A **transition** is a smooth slide between *two* states triggered by something changing — like a button growing when you hover. An **animation** is a full choreographed sequence with as many steps as you want, can loop forever, and can play on its own without any trigger — like a spinning loading icon.

**Comparison:**

| | Transition | Animation (`@keyframes`) |
|---|---|---|
| States | Two (from → to) | Many (0% → 50% → 100% …) |
| Needs a trigger? | Yes (e.g. `:hover`, class change) | No (can autoplay) |
| Can loop? | No | Yes (`infinite`) |
| Best for | Hover effects, simple toggles | Loaders, complex multi-step motion |

```css
/* TRANSITION — animates the change between two states */
.box {
  transition: transform 0.3s ease;  /* smoothly animate transform over 0.3s */
}
.box:hover {
  transform: scale(1.1);            /* trigger: grows to 110% on hover */
}

/* ANIMATION — defined keyframes, runs on its own, loops forever */
@keyframes spin {
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite; /* spins continuously, no trigger needed */
}
```
**Output:** Hovering `.box` makes it smoothly swell to 110%; `.loader` rotates endlessly the moment the page loads.

**Rule of thumb:** Reach for a transition for simple A↔B state changes; reach for `@keyframes` when you need multiple steps, looping, or autoplay. For performance, prefer animating `transform` and `opacity` (GPU-accelerated) over properties like `width`/`top` that trigger layout.

---

### 27. What is the specificity of inline styles vs `!important`?

**Plain-English intuition:** Inline styles (`style="..."`) are very powerful — they normally beat anything in your stylesheet. But `!important` is the "trump card" that can override even inline styles. Think of `!important` as standing on a chair to be taller than everyone, and inline styles as a tall person on the ground — the person on the chair still wins.

**The priority ladder (highest wins):**
```
1. !important  inline style        (style="color:red !important")   ← absolute top
2. !important  in a stylesheet     (.x { color: red !important; })
3. inline style (no !important)     (style="color:red")
4. ID selectors                     (#x)
5. class / attribute / pseudo-class (.x, [type], :hover)
6. element / pseudo-element         (div, ::before)
7. browser defaults                                                  ← lowest
```

```css
/* stylesheet */
p { color: blue !important; }   /* level 2 */
```
```html
<p style="color: red;">Text</p>  <!-- level 3 -->
<!-- Result: BLUE — the stylesheet's !important (level 2) beats the inline style (level 3) -->

<p style="color: green !important;">Text</p> <!-- level 1 -->
<!-- Result: GREEN — inline !important (level 1) beats stylesheet !important (level 2) -->
```

**Rule of thumb:** Avoid `!important` — it short-circuits the normal cascade and the only way to override it is *another* `!important`, leading to escalating wars that make CSS unmaintainable. Reserve it for genuine emergencies (e.g., overriding a third-party widget you can't edit). Prefer increasing specificity normally instead.

---
# Section 2 — JavaScript

### 28. `var` vs `let` vs `const`

**Intuition first.** Think of these three as three kinds of boxes for storing values, and the main thing that separates them is *where the box is visible* (its scope) and *whether you're allowed to swap what's inside*. `var` is the old, leaky box from 1995 that ignores `{ }` walls. `let` and `const` are the modern, well-behaved boxes that respect block walls — and `const` additionally has a lock on the lid.

**The precise rules.**

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block (`{ }`) | block (`{ }`) |
| Hoisting | yes → initialized to `undefined` | yes → but in TDZ (no value) | yes → but in TDZ (no value) |
| Reassignable | yes | yes | no |
| Redeclarable in same scope | yes | no | no |
| Must initialize at declaration | no | no | **yes** |

- **`var`** is *function-scoped*: it ignores `if`/`for` blocks and only respects function boundaries. It's hoisted as `undefined`, which causes silent bugs. Avoid in modern code.
- **`let`** is *block-scoped* and reassignable — use it when a value changes.
- **`const`** is *block-scoped* and cannot be *reassigned*. Important nuance: `const` locks the **variable binding**, not the **value**. An object or array held by a `const` can still be mutated.
- **TDZ (Temporal Dead Zone)** — `let`/`const` technically exist from the top of the block, but touching them before the declaration line throws a `ReferenceError`.

```js
function demo() {
  console.log(v); // undefined — var is hoisted & auto-initialized
  // console.log(l); // ReferenceError — l is in the TDZ
  var v = 1;
  let l = 2;
}

if (true) {
  var leaks = "I escape the block";
  let stays = "I stay in the block";
}
console.log(leaks); // "I escape the block" — var ignores the { } walls
// console.log(stays); // ReferenceError — let respected the block

const obj = { a: 1 };
obj.a = 99;        // OK — mutating the contents is allowed
// obj = {};       // TypeError — reassigning the binding is NOT allowed
```

**Common gotcha — `var` in loops:** Because `var` is function-scoped, a single `var i` is shared across every loop iteration, so async callbacks all see the final value. `let` creates a fresh binding per iteration.

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3, 3, 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0, 1, 2
```

---

### 29. What is hoisting?

**Intuition first.** Before JavaScript *runs* your code, it does a quick "read-through" of each scope and makes a note of every variable and function you declared. So by the time it actually executes line by line, the *names* already exist — even if their *values* don't yet. People describe this as "declarations being moved to the top," but nothing physically moves; the engine just registered the names ahead of time.

**The precise rules — what gets hoisted, and in what state:**

| Declaration | Hoisted? | Usable before its line? |
|---|---|---|
| `var x` | Yes, initialized to `undefined` | Yes (but value is `undefined`) |
| `let` / `const` | Yes, but uninitialized (TDZ) | No → `ReferenceError` |
| `function foo() {}` (declaration) | Yes, fully (name + body) | Yes — fully callable |
| `const foo = () => {}` (expression) | Follows the variable's rule | No |

**Timeline of execution for `var` and a function declaration:**

```
COMPILE PASS (before any line runs):
  ┌─────────────────────────────────────┐
  │ register `a`  → undefined            │
  │ register `foo` → [full function]     │
  └─────────────────────────────────────┘
EXECUTION PASS (top to bottom):
  console.log(a) → reads `a` → undefined
  a = 5          → `a` now holds 5
  foo()          → already defined → runs fine
```

```js
console.log(a); // undefined — `a` was hoisted and auto-set to undefined
var a = 5;

foo();          // "works!" — function declarations are fully hoisted
function foo() { console.log("works!"); }

// bar();       // ReferenceError — bar is in the TDZ here
const bar = () => {};
```

**Follow-up to expect:** "Why does a function declaration run before its line but a `const` arrow function doesn't?" — Because the *whole* function declaration (name + body) is hoisted, whereas an arrow function is just a value assigned to a `const`, and `const` sits in the TDZ until its line executes.

---

### 30. Explain closures.

**Intuition first.** Imagine a function packs a small backpack the moment it's created. Into that backpack it puts references to all the variables it could "see" in the place where it was born. Even after that birthplace function has finished and disappeared, the inner function still carries its backpack — so it can keep reading and updating those variables. That backpack-carrying function is a **closure**.

**Precise definition.** A closure is the combination of a function plus the lexical environment (the set of outer variables) in which it was declared. JavaScript keeps that environment alive as long as the inner function that references it is alive.

**Scope-retention diagram:**

```
counter() called
  ┌──────────────────────────┐
  │ local: count = 0         │◄────────┐  the returned function
  │ returns ───────────────► │         │  keeps a live reference
  └──────────────────────────┘         │  to `count`, so the
counter() finishes... but `count`      │  environment is NOT
does NOT get garbage-collected ────────┘  garbage-collected
```

```js
function counter() {
  let count = 0;              // private variable, lives in the closure
  return function () {
    count++;                  // still reachable after counter() returned
    return count;
  };
}
const inc = counter();
console.log(inc()); // 1
console.log(inc()); // 2  — same `count` is remembered and updated
const inc2 = counter();
console.log(inc2()); // 1 — a fresh closure with its own separate `count`
```

**Uses:** data privacy/encapsulation (the only way to touch `count` is through `inc`), function factories, memoization caches, event handlers and `setTimeout` callbacks that need to "remember" a value, and the module pattern.

**Common gotcha:** Closures in a `var` loop all share one variable (see Q28). Each call to the outer function creates a *new* independent closure — that's why `inc` and `inc2` above don't interfere.

---

### 31. What is the difference between `==` and `===`?

**Intuition first.** `===` is the strict, suspicious comparison: "Are you *exactly* the same value *and* the same type?" `==` is the easygoing one: "Eh, let me convert you both to a common type first, then compare" — which feels convenient but produces surprising results.

- **`==`** (loose / abstract equality) — performs **type coercion** before comparing. `1 == "1"` becomes `true` because the string `"1"` is converted to the number `1`.
- **`===`** (strict equality) — compares **value and type** with no conversion. `1 === "1"` is `false` because a number is not a string.

```js
1 == "1";        // true  — "1" coerced to 1
1 === "1";       // false — different types
0 == false;      // true  — false coerced to 0
0 === false;     // false
null == undefined;  // true  — special rule: they're loosely equal
null === undefined; // false — different types
NaN === NaN;        // false — NaN is never equal to anything, use Number.isNaN()
```

**Rule of thumb:** Always use `===` (and `!==`). The one common, intentional use of `==` is `x == null`, which neatly checks for *both* `null` and `undefined` at once.

---

### 32. Explain `this` in JavaScript.

**Intuition first.** `this` does **not** mean "the function I'm inside." It means "the object that's responsible for this call right now." The trick: you usually figure out `this` by looking at *how the function was called*, not where it was written. The simplest tell is "what's immediately to the left of the dot at call time?"

**The binding rules, in priority order:**

| How the function is called | What `this` is |
|---|---|
| `new Fn()` | the brand-new object being constructed |
| `fn.call(o)` / `fn.apply(o)` / `fn.bind(o)()` | `o` (explicitly set) |
| `obj.method()` | `obj` (the thing before the dot) |
| `fn()` (plain call) | `undefined` in strict mode, else global (`window`) |
| arrow function | inherited from the enclosing scope — arrows have **no own `this`** |

```js
const obj = {
  name: "Rajveer",
  greet() { return this.name; },      // called as obj.greet() → this = obj
  greetArrow: () => this.name,         // arrow → this = outer scope, NOT obj
};
console.log(obj.greet());      // "Rajveer"
console.log(obj.greetArrow()); // undefined (outer `this` has no `name`)

const fn = obj.greet;
console.log(fn());             // undefined — called bare, `this` is no longer obj
```

**Common gotcha:** Passing a method as a callback (`setTimeout(obj.greet, 100)`) "loses" `this` because it's now a bare call. Fix it with `obj.greet.bind(obj)` or wrap it in an arrow: `() => obj.greet()`.

---

### 33. Difference between `call`, `apply`, and `bind`.

**Intuition first.** All three let you *borrow* a function and force it to treat some object as its `this`. The difference is purely about **timing** and **how you hand over the arguments**. Memory aid: **A**pply takes an **A**rray; **C**all takes a **C**omma-list; **B**ind makes a **B**ound copy for later.

| Method | When it runs | How args are passed | Returns |
|---|---|---|---|
| `call(thisArg, a, b)` | immediately | one by one | the function's result |
| `apply(thisArg, [a, b])` | immediately | as a single array | the function's result |
| `bind(thisArg, a)` | later, when you call it | one by one (can pre-fill some) | a **new function** |

```js
function greet(greeting, punctuation) {
  return greeting + " " + this.name + punctuation;
}
const user = { name: "Sam" };

greet.call(user, "Hi", "!");        // "Hi Sam!"  — runs now, comma args
greet.apply(user, ["Hi", "!"]);     // "Hi Sam!"  — runs now, array args
const bound = greet.bind(user, "Hello"); // returns a function, "Hello" pre-filled
bound("?");                         // "Hello Sam?" — runs later
```

**Handy real use:** `Math.max.apply(null, [3, 1, 7])` spreads an array as arguments (though `Math.max(...arr)` is the modern way), and `bind` is the classic fix for losing `this` in callbacks.

---

### 34. Arrow functions vs regular functions.

**Intuition first.** An arrow function is a lightweight function that deliberately *gives up* some of a regular function's machinery in exchange for predictable behavior — most importantly, it doesn't create its own `this`. That makes arrows perfect as callbacks where you want to keep the surrounding `this`.

| Feature | Regular `function` | Arrow `=>` |
|---|---|---|
| Own `this` | Yes (depends on call site) | No — inherits lexically |
| `arguments` object | Yes | No (use rest `...args`) |
| Usable with `new` | Yes (constructor) | No → throws |
| Has `.prototype` | Yes | No |
| Can be hoisted | Yes (declaration form) | No |

```js
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    setInterval(() => { this.seconds++; }, 1000); // arrow keeps `this` = the Timer
    // setInterval(function () { this.seconds++; }) // BUG: `this` would be wrong here
  }
}
```

**Rule of thumb:** Use arrows for short callbacks and anywhere you want to preserve `this`. Use regular functions for object methods that rely on `this`, and for constructors.

---

### 35. What is the event loop? (Very common)

**Intuition first.** JavaScript has only **one** worker (single thread). To stay responsive, slow jobs (timers, network, DOM events) are handed off to the browser's background helpers (**Web APIs**). When a slow job finishes, its callback waits in a **queue**. The **event loop** is a tireless manager that follows one rule: *"If the worker (call stack) is free, give it the next waiting job."* Crucially, there are two queues, and one always jumps the line.

**The machinery:**

```
        ┌───────────────┐         ┌──────────────────────┐
        │   Call Stack  │ ──────► │       Web APIs        │
        │ (runs sync    │         │ setTimeout, fetch,    │
        │  code now)    │         │ DOM events, etc.      │
        └───────▲───────┘         └──────────┬───────────┘
                │                            │ (when done, callback queued)
                │           ┌────────────────┴─────────────────┐
                │           ▼                                   ▼
          ┌─────┴──────────────────┐          ┌───────────────────────────┐
          │   MICROTASK queue      │          │   MACROTASK queue          │
          │ Promise.then,          │          │ setTimeout, setInterval,   │
          │ queueMicrotask,        │          │ I/O, UI events             │
          │ MutationObserver       │          │                            │
          └────────────────────────┘          └───────────────────────────┘
   Event loop rule: stack empty → drain ALL microtasks → then ONE macrotask → repeat
```

**Step-by-step trace of the classic example:**

```js
console.log("1");                                   // sync
setTimeout(() => console.log("2"), 0);              // macrotask
Promise.resolve().then(() => console.log("3"));     // microtask
console.log("4");                                   // sync
// Output: 1, 4, 3, 2
```

```
Step 1: run console.log("1")  → prints 1.   Stack now empty-ish.
Step 2: setTimeout(...0) → callback "2" parked in MACROtask queue.
Step 3: Promise.then     → callback "3" parked in MICROtask queue.
Step 4: run console.log("4")  → prints 4.   Sync code done, stack empty.
Step 5: Event loop drains ALL microtasks first → runs "3" → prints 3.
Step 6: Only now does it take ONE macrotask → runs "2" → prints 2.
```

**Key takeaway:** Microtasks (Promise `.then`, `await` continuations) always run before the next macrotask (`setTimeout`), even with a `0ms` delay. `setTimeout(fn, 0)` does **not** mean "run now" — it means "run after the current sync code *and* all pending microtasks."

---

### 36. Explain Promises.

**Intuition first.** A Promise is like a restaurant buzzer. You order food (start an async task) and get a buzzer immediately — you don't stand frozen at the counter. The buzzer is in one of three states: still waiting (**pending**), it lights up "food ready" (**fulfilled**), or it shows "order failed" (**rejected**). You register what to do when it eventually settles, then go sit down.

**The three states (a promise settles exactly once, then never changes):**

```
            ┌─► fulfilled  → .then(value)
pending ────┤
            └─► rejected   → .catch(error)
                  (either way) → .finally()
```

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000); // settles after 1s
});
p.then(result => console.log(result))    // "done" — runs on fulfillment
 .catch(err => console.error(err))       // runs on rejection
 .finally(() => console.log("cleanup")); // always runs, success or failure
```

**Why they matter:** Promises replace deeply nested "callback hell" with a flat, chainable pipeline. Each `.then` can return a value (or another promise) that flows to the next `.then`, and a single `.catch` at the end handles errors from anywhere in the chain.

```js
fetch("/api/user")
  .then(res => res.json())        // value flows down the chain
  .then(user => console.log(user))
  .catch(err => console.error(err)); // one catch handles any earlier failure
```

---

### 37. `async`/`await` — how does it work?

**Intuition first.** `async/await` is a friendlier costume over Promises. It lets you *write* asynchronous code that *reads* top-to-bottom like ordinary synchronous code, while still being non-blocking under the hood. `await` is the word for "pause this function here, let the rest of the program keep running, and resume me with the result once the promise settles."

- An `async` function **always returns a Promise** (any value you `return` is wrapped in `Promise.resolve`).
- `await` only pauses the *current async function*, not the whole program — the event loop keeps spinning.
- Errors are handled with ordinary `try/catch`, which is the big readability win.

```js
async function getUser() {
  try {
    const res = await fetch("/api/user"); // pause until the response arrives
    const data = await res.json();        // pause until JSON is parsed
    return data;                          // wrapped in a resolved Promise
  } catch (err) {
    console.error(err);                   // catches network OR parse errors
  }
}
getUser().then(user => console.log(user)); // it returns a Promise, so .then works
```

**Common gotcha — accidental serial awaits:** Awaiting in a loop runs requests one-after-another. To run them in parallel, kick them all off first and await together with `Promise.all`:

```js
// Slow (serial): each await waits for the previous
// const a = await taskA(); const b = await taskB();
// Fast (parallel):
const [a, b] = await Promise.all([taskA(), taskB()]);
```

---

### 38. `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`

**Intuition first.** These are four strategies for combining many promises, differing on two questions: *do you wait for everyone or just the first?* and *does one failure ruin it?*

| Method | Resolves when... | Rejects when... | Gives you |
|---|---|---|---|
| `Promise.all` | **all** fulfill | **any** one rejects (fails fast) | array of values |
| `Promise.allSettled` | **all** settle (no matter what) | never | array of `{status, value/reason}` |
| `Promise.race` | the **first** settles (fulfill **or** reject) | if the first one rejects | the first settled outcome |
| `Promise.any` | the **first** fulfillment | only if **all** reject (`AggregateError`) | the first fulfilled value |

```js
const ok = Promise.resolve("ok");
const bad = Promise.reject("bad");

await Promise.all([ok, ok]);        // ["ok", "ok"]
// await Promise.all([ok, bad]);    // throws "bad" — one failure kills it
await Promise.allSettled([ok, bad]);
// [{status:"fulfilled", value:"ok"}, {status:"rejected", reason:"bad"}]
await Promise.any([bad, ok]);       // "ok" — ignores rejections, takes first success
```

**When to pick which:** `all` when you need every result and any failure is fatal; `allSettled` when you want every outcome regardless (e.g., a dashboard of independent widgets); `race` for timeouts; `any` for "give me whichever mirror responds first."

---

### 39. What is the difference between synchronous and asynchronous code?

**Intuition first.** Synchronous code is like a single checkout line where each customer must finish completely before the next begins — if someone is slow, everybody waits. Asynchronous code is like ordering at a counter, getting a buzzer, and stepping aside so others can order while your food cooks.

- **Synchronous** — runs line by line; each operation **blocks** the thread until it completes. A slow synchronous task (a big loop) freezes the whole page.
- **Asynchronous** — slow operations (network requests, timers, file I/O) are offloaded to background Web APIs; the main thread keeps running, and a callback/Promise notifies you when the work is done.

```js
console.log("A");
setTimeout(() => console.log("B"), 0); // async — deferred
console.log("C");
// Output: A, C, B  — C does not wait for the timer
```

**Why it matters:** JavaScript is single-threaded, so blocking the thread blocks *everything* (clicks, rendering, scrolling). Async patterns keep the UI responsive.

---

### 40. Explain prototypal inheritance.

**Intuition first.** Every JavaScript object has a secret "see also" pointer to another object, its **prototype**. When you ask an object for a property it doesn't have, JavaScript doesn't give up — it follows that pointer to the prototype, then that prototype's prototype, and so on, climbing a chain until it finds the property or hits `null`. This is how objects share behavior without copying it.

**The prototype chain:**

```
dog ──[[Prototype]]──► animal ──[[Prototype]]──► Object.prototype ──► null
{barks:true}           {eats:true}               {toString, ...}

Looking up dog.eats:
  1. on dog?     no
  2. on animal?  YES → returns true  (search stops here)

Looking up dog.toString:
  1. dog? no → 2. animal? no → 3. Object.prototype? YES
```

```js
const animal = { eats: true };
const dog = Object.create(animal); // dog's prototype IS animal
dog.barks = true;

console.log(dog.barks); // true  — own property
console.log(dog.eats);  // true  — inherited by walking up the chain
console.log(dog.hasOwnProperty("eats")); // false — it's not dog's own
```

**Connection to classes:** `class` syntax is just sugar over this mechanism. `class Dog extends Animal` sets up the same prototype chain; methods you define on the class live on `Dog.prototype`, shared by every instance rather than copied into each one.

---

### 41. Difference between `null` and `undefined`.

**Intuition first.** `undefined` means "this slot exists but nobody has put anything in it yet" — it's the *default* emptiness JavaScript assigns. `null` means "I, the programmer, am deliberately telling you there is no value here" — it's *intentional* emptiness.

| | `undefined` | `null` |
|---|---|---|
| Who sets it | JavaScript, automatically | You, on purpose |
| Meaning | value not assigned yet | intentional "no value" |
| `typeof` | `"undefined"` | `"object"` (a famous historical bug) |

```js
let a;                 // declared, never assigned
console.log(a);        // undefined

let b = null;          // explicitly emptied by me
console.log(b);        // null

console.log(a == b);   // true  — loosely equal (special rule)
console.log(a === b);  // false — different types
console.log(typeof a, typeof b); // "undefined" "object"
```

**Practical tip:** `value == null` is a clean idiom that's `true` for both `null` and `undefined`, useful for "is this missing?" checks.

---

### 42. What are the primitive data types in JavaScript?

**Intuition first.** Primitives are the simplest, indivisible values — a single number, a single piece of text, a true/false. They are **immutable** (you can't change the value itself, only point a variable at a new one) and are copied **by value**. Everything else (objects, arrays, functions) is a *reference type*.

**The 7 primitives:**

| Type | Example | Note |
|---|---|---|
| `string` | `"hi"` | text |
| `number` | `42`, `3.14` | all numbers (no separate int/float) |
| `boolean` | `true` | true/false |
| `null` | `null` | intentional emptiness |
| `undefined` | `undefined` | not assigned |
| `symbol` | `Symbol("id")` | unique identifier |
| `bigint` | `10n` | integers beyond `Number.MAX_SAFE_INTEGER` |

```js
let x = 10;
let y = x;   // y gets a COPY of the value
y = 20;
console.log(x, y); // 10 20 — changing y did not touch x (copied by value)

let s = "abc";
s[0] = "z";        // silently ignored — strings are immutable
console.log(s);    // "abc"
```

---

### 43. Pass by value vs pass by reference.

**Intuition first.** When you pass a **primitive** into a function, JavaScript hands over a *photocopy* — scribble on the copy and the original is untouched. When you pass an **object/array**, JavaScript hands over a *copy of the address* pointing to the same box in memory — so if the function reaches into that box and changes its contents, the change is visible everywhere.

**Memory-box diagram:**

```
PRIMITIVE (copy of value):
   n = 5  ──► [ 5 ]        function gets ──► [ 5 ] (separate box)
                                  changing it never affects n

OBJECT (copy of the reference/address):
   nums ──► (addr #42) ──► [1,2,3]
   arg  ──► (addr #42) ────────┘   both point at the SAME array
                                  arg.push(4) mutates the shared array
```

```js
function changePrimitive(x) { x = 99; }
let n = 5;
changePrimitive(n);
console.log(n); // 5 — primitive copied, original safe

function mutate(arr) { arr.push(4); } // mutating the SHARED object
const nums = [1, 2, 3];
mutate(nums);
console.log(nums); // [1, 2, 3, 4] — the original was changed

function reassign(arr) { arr = [9, 9]; } // reassigns the local copy only
reassign(nums);
console.log(nums); // [1, 2, 3, 4] — unchanged; reassignment breaks the link
```

**Key nuance:** Reassigning the parameter (`arr = ...`) only repoints the local copy of the address — it does **not** affect the caller. Only *mutating* the shared object does.

---

### 44. Explain `map`, `filter`, and `reduce`.

**Intuition first.** These three are an assembly line for arrays. **`map`** is a transformer — every item goes in, a changed item comes out, same count. **`filter`** is a sieve — only items that pass a test get through. **`reduce`** is a funnel — it accumulates the whole array down into one final value. All three are non-mutating (they leave the original array alone).

| Method | Input → Output | Purpose |
|---|---|---|
| `map` | N items → N items | transform each |
| `filter` | N items → ≤N items | keep matches |
| `reduce` | N items → 1 value | accumulate |

```js
const nums = [1, 2, 3, 4];

nums.map(n => n * 2);             // [2, 4, 6, 8]     transform each element
nums.filter(n => n % 2 === 0);   // [2, 4]           keep only evens
nums.reduce((acc, n) => acc + n, 0); // 10           acc starts at 0, sums up

// reduce trace: acc=0 +1=1 +2=3 +3=6 +4=10
```

**Power move — chain them:** because `map` and `filter` return arrays, you can pipe them.

```js
[1, 2, 3, 4, 5]
  .filter(n => n % 2)     // [1, 3, 5] odds
  .map(n => n * n)        // [1, 9, 25] squared
  .reduce((a, b) => a + b); // 35 summed
```

---

### 45. `forEach` vs `map`.

**Intuition first.** Both visit every element, but they have different *purposes*. `forEach` is for **doing something** (a side effect, like logging or updating the DOM) and gives you nothing back. `map` is for **building a new array** from the transformed elements.

| | `forEach` | `map` |
|---|---|---|
| Returns | `undefined` | a new array |
| Purpose | side effects | transformation |
| Chainable | no | yes |

```js
const nums = [1, 2, 3];

const a = nums.forEach(n => console.log(n)); // logs 1,2,3
console.log(a); // undefined — nothing to chain on

const b = nums.map(n => n * 10); // [10, 20, 30]
console.log(b); // a usable new array
```

**Rule of thumb:** If you're using the returned array, use `map`. If you're not (just causing effects), use `forEach`. Using `map` *only* for side effects (ignoring the result) is a smell.

---

### 46. What is the spread and rest operator (`...`)?

**Intuition first.** Same three dots, opposite directions. **Spread** *unpacks* — it pours the contents of an array/object out into individual pieces. **Rest** *gathers* — it scoops up "everything else" into one array/object. A trick to tell them apart: if `...` is on the **right** of `=` or inside a call, it's spreading *out*; if it's on the **left** (a parameter or destructuring target), it's collecting *in*.

```js
// SPREAD — unpacks into individual elements
const arr = [1, 2, 3];
const copy = [...arr, 4];             // [1, 2, 3, 4]  (shallow copy + add)
const merged = { ...{ a: 1 }, b: 2 }; // { a: 1, b: 2 }
Math.max(...arr);                     // 3  (array → individual args)

// REST — collects multiple items into one array
function sum(...nums) {               // nums = [1, 2, 3]
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);                         // 6

const [first, ...others] = [1, 2, 3]; // first = 1, others = [2, 3]
```

**Common gotcha:** Spread makes a **shallow** copy — nested objects are still shared by reference (see Q54).

---

### 47. What is destructuring?

**Intuition first.** Destructuring is a shorthand for unpacking values out of arrays or objects into their own variables in a single line, instead of writing `const x = obj.x; const y = obj.y;` repeatedly. For arrays it unpacks by *position*; for objects it unpacks by *property name*.

```js
const user = { name: "Sam", age: 30, address: { city: "Pune" } };

const { name, age = 18 } = user;     // name="Sam"; age=30 (default 18 if missing)
const [a, b] = [1, 2];               // a=1, b=2 (by position)
const { address: { city } } = user;  // city="Pune" (nested)
const { name: userName } = user;     // rename → userName="Sam"

function greet({ name }) {            // destructure right in the parameters
  return `Hi ${name}`;
}
greet(user); // "Hi Sam"
```

**Why it's useful:** cleaner React props (`function Card({ title, body })`), pulling fields from API responses, and swapping variables in one line: `[x, y] = [y, x]`.

---

### 48. Explain `debounce` and `throttle`.

**Intuition first.** Both stop a function from firing too often during rapid events (typing, scrolling, resizing). **Debounce** waits for *quiet*: "only run after the user has stopped for X ms" — great for a search box that fires once the user finishes typing. **Throttle** enforces a *steady rhythm*: "run at most once every X ms no matter how many events arrive" — great for scroll handlers.

**Timeline diagram (events marked `|`, ⚡ = function actually runs):**

```
Events:    | | | |       | |
           ───────────────────────────► time

DEBOUNCE (delay 300ms, runs after a pause):
                   ⚡(after the burst settles)         ⚡(after 2nd burst)

THROTTLE (interval 300ms, runs on a fixed cadence):
           ⚡        ⚡        ⚡
           └─300ms─┘ └─300ms─┘
```

```js
// DEBOUNCE — resets the timer on every call; only the last one survives
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                       // cancel the previous wait
    timer = setTimeout(() => fn(...args), delay); // restart the wait
  };
}

// THROTTLE — ignores calls until the cooldown has elapsed
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {              // enough time passed?
      last = now;
      fn(...args);
    }
  };
}
```

**Pick:** debounce for "wait until they're done" (search, autosave); throttle for "regular updates while it's happening" (scroll position, drag, window resize).

---

### 49. What is event delegation?

**Intuition first.** Instead of pinning a sticky note (listener) on every single child element, you pin **one** note on their shared parent. Because clicks bubble up from the child to the parent, the parent's listener hears all of them and uses `event.target` to figure out which child was actually clicked. One listener handles many children — even ones added to the page *later*.

```js
// One listener on the <ul> handles clicks on any <li>, present or future
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked:", e.target.textContent);
  }
});
// Adding a new <li> later still works — no need to attach a new listener
```

**Why it's good:** fewer listeners (less memory), automatically covers dynamically added elements, and simpler cleanup. It relies entirely on **event bubbling** (next question).

---

### 50. Explain event bubbling vs capturing.

**Intuition first.** When you click a button inside a div inside the body, the click doesn't just happen on the button — it takes a round trip through the DOM tree. First it dives *down* from the top to the target (**capturing**), lands on the **target**, then ripples back *up* to the top (**bubbling**). By default, your listeners fire on the way *up* (bubbling).

**The three phases:**

```
              ┌───────── CAPTURING (top → target) ─────────┐
   document ─► html ─► body ─► div ─► [BUTTON]   ◄── TARGET phase
              └───────── BUBBLING (target → top) ──────────┘
                        ▲                          (default phase
                        └── events ripple back up      for listeners)
```

```js
parent.addEventListener("click", () => console.log("parent"));       // bubbling (default)
child.addEventListener("click", () => console.log("child"));
// Clicking child logs: "child" then "parent" (bubbles up)

parent.addEventListener("click", () => console.log("capture"), true); // capture phase
// With capture:true, "capture" (parent) logs BEFORE "child"
```

- `addEventListener(type, fn, true)` (or `{ capture: true }`) listens during the **capture** phase.
- `e.stopPropagation()` halts the journey so ancestors don't hear it.
- `e.preventDefault()` cancels the browser's **default action** (e.g., stop a form submitting) — it does *not* stop propagation.

---

### 51. What is the difference between `slice` and `splice`?

**Intuition first.** They look almost identical but behave oppositely on one crucial point: **`slice` is a polite copier** that leaves the original alone, while **`splice` is a surgeon** that cuts into and changes the original array. Memory aid: spli**ce** has an extra letter and does extra (mutating) work.

| | `slice(start, end)` | `splice(start, deleteCount, ...items)` |
|---|---|---|
| Mutates original? | No | **Yes** |
| Returns | a shallow copy of the slice | the removed elements |
| Can insert items? | No | Yes |

```js
const arr = [1, 2, 3, 4, 5];

const part = arr.slice(1, 3);   // [2, 3]  — copy; `end` is exclusive
console.log(arr);               // [1, 2, 3, 4, 5] — UNCHANGED

const removed = arr.splice(1, 2, "a", "b"); // remove 2 from index 1, insert a,b
console.log(removed);           // [2, 3] — what was removed
console.log(arr);               // [1, "a", "b", 4, 5] — MUTATED
```

---

### 52. What are higher-order functions?

**Intuition first.** A higher-order function is just a function that treats *other functions* as data — it either **takes a function as an argument**, **returns a function**, or both. This is possible because in JavaScript functions are "first-class": you can store them in variables, pass them around, and return them like any other value.

```js
// Takes a function as an argument:
[1, 2, 3].map(n => n * 2);          // map receives a function
setTimeout(() => console.log("hi"), 100);

// Returns a function (a function factory):
function multiplier(factor) {
  return (n) => n * factor;          // returns a new function
}
const double = multiplier(2);
double(5); // 10
```

Familiar examples: `map`, `filter`, `reduce`, `forEach`, `sort`, `addEventListener`, and `debounce`/`throttle` (which both take *and* return functions).

---

### 53. What is currying?

**Intuition first.** Currying breaks a function that wants *several* arguments at once into a chain of functions that each take *one* argument and hand back the next function, until all the arguments are collected. It's like a vending machine that asks for coins one at a time before dispensing.

```js
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6

// equivalent step-by-step:
const step1 = add(1);  // a captured = 1, returns b => ...
const step2 = step1(2);// b captured = 2, returns c => ...
step2(3);              // 1 + 2 + 3 = 6
```

**Why it's useful — partial application:** you can pre-fill some arguments and reuse the result.

```js
const addTax = rate => price => price + price * rate;
const addGst = addTax(0.18);   // rate locked at 18%
addGst(100); // 118
addGst(200); // 236
```

---

### 54. Difference between shallow copy and deep copy.

**Intuition first.** A **shallow copy** duplicates only the outer shell of an object. If a property is itself an object, the copy doesn't get its own version — it just shares a pointer to the *same* nested object, so editing the nested part affects both. A **deep copy** recursively clones everything, producing a fully independent twin.

```
ORIGINAL:  { name, hobbies ──► [ "a", "b" ] }
                                    ▲
SHALLOW:   { name, hobbies ─────────┘   (nested array is SHARED!)
DEEP:      { name, hobbies ──► [ "a", "b" ] }  (its own separate array)
```

```js
const original = { name: "Sam", hobbies: ["reading"] };

const shallow = { ...original };          // or Object.assign({}, original)
shallow.hobbies.push("coding");
console.log(original.hobbies);            // ["reading","coding"] — leaked! shared ref

const deep = structuredClone(original);   // fully independent clone
deep.hobbies.push("gaming");
console.log(original.hobbies);            // unchanged by deep edits
```

**Tools:** shallow → `{...obj}`, `Object.assign`, `Array.slice`. Deep → `structuredClone(obj)` (modern, preferred) or `JSON.parse(JSON.stringify(obj))` (quick but drops functions, `undefined`, and turns `Date` into a string).

---

### 55. What is the difference between function declaration and function expression?

**Intuition first.** A **declaration** is a standalone, named function statement that JavaScript registers fully during hoisting — so you can call it even *above* where it's written. An **expression** is a function used as a *value* (assigned to a variable), so it only exists once that assignment line runs.

```js
sayHi();   // "hi" — declaration is fully hoisted, callable early
function sayHi() { console.log("hi"); }

// sayBye(); // TypeError — sayBye is undefined until this line runs
const sayBye = function () { console.log("bye"); }; // expression
sayBye();  // "bye"
```

| | Declaration | Expression |
|---|---|---|
| Syntax | `function foo() {}` | `const foo = function () {}` |
| Hoisted (callable early)? | Yes, fully | No (follows the variable) |
| Can be anonymous | No (has a name) | Yes |

---

### 56. What are `Set` and `Map`?

**Intuition first.** A **`Set`** is a bag that automatically refuses duplicates — perfect for "give me the unique values." A **`Map`** is a dictionary like an object, but its keys can be *any type* (objects, functions, numbers — not just strings), it remembers insertion order, and it has a true `.size` and easy iteration.

```js
// SET — unique values only
const s = new Set([1, 1, 2, 3, 3]);
console.log([...s]);     // [1, 2, 3] — duplicates dropped
const unique = [...new Set([1, 1, 2])]; // classic de-dup idiom → [1, 2]

// MAP — any key type, ordered, with .size
const m = new Map();
const keyObj = { id: 1 };
m.set("name", "Sam");
m.set(keyObj, "object as a key!"); // objects can be keys (impossible with {})
console.log(m.get(keyObj));        // "object as a key!"
console.log(m.size);               // 2
```

**When to choose `Map` over a plain object:** frequent additions/removals, non-string keys, when you need reliable ordering and `.size`, or to avoid accidental clashes with inherited keys like `toString`.

---

### 57. What is the difference between `Object.freeze` and `const`?

**Intuition first.** They protect different things. `const` locks the **label** — you can't repoint the variable to a different value. `Object.freeze` locks the **contents** — you can't add, remove, or change the object's properties. You often want both for a true constant.

| | `const` | `Object.freeze(obj)` |
|---|---|---|
| Prevents reassigning the variable | Yes | No |
| Prevents changing properties | No | Yes (shallow) |

```js
const user = { name: "Sam" };
user.name = "Max";   // ALLOWED — const doesn't lock properties
// user = {};        // TypeError — but reassignment is blocked

const frozen = Object.freeze({ name: "Sam", info: { city: "Pune" } });
frozen.name = "Max"; // silently ignored (throws in strict mode)
console.log(frozen.name); // "Sam"

frozen.info.city = "Delhi"; // STILL works — freeze is SHALLOW
console.log(frozen.info.city); // "Delhi"
```

**Gotcha:** `Object.freeze` is *shallow* — nested objects stay mutable. For deep immutability you must recursively freeze (a "deep freeze").

---

### 58. Explain the difference between `==`, type coercion, and truthy/falsy.

**Intuition first.** Three related ideas about how JavaScript treats values loosely. **Type coercion** is the engine automatically converting one type to another. **`==`** uses that coercion when comparing. **Truthy/falsy** is how a value behaves when JavaScript needs a boolean (in an `if`, `&&`, etc.) — most values are "truthy," and there's a short fixed list of "falsy" ones worth memorizing.

**The 8 falsy values (everything else is truthy):**

```
false   0   -0   0n(BigInt zero)   ""(empty string)   null   undefined   NaN
```

```js
// Surprising TRUTHY values — these are NOT falsy:
if ("0") console.log("runs");   // runs! non-empty string is truthy
if ("false") console.log("runs"); // runs! it's a non-empty string
if ([]) console.log("runs");    // runs! an empty array is truthy
if ({}) console.log("runs");    // runs! an empty object is truthy

// Coercion in == comparisons:
"" == 0;      // true  — "" coerced to 0
[] == false;  // true  — [] → "" → 0, false → 0
```

**Takeaway:** Empty arrays/objects and the strings `"0"`/`"false"` are truthy — a frequent source of bugs. Use `===` and explicit checks (`arr.length === 0`) to stay safe.

---

### 59. What is the difference between `find`, `findIndex`, `some`, and `every`?

**Intuition first.** All four scan an array with a test function, but they answer different questions. `find`/`findIndex` are about *locating* (give me the matching item, or its position). `some`/`every` are about a *yes/no verdict* (does at least one match? do they all match?).

| Method | Question it answers | Returns |
|---|---|---|
| `find` | which is the first match? | the element (or `undefined`) |
| `findIndex` | where is the first match? | the index (or `-1`) |
| `some` | does **any** match? | boolean |
| `every` | do **all** match? | boolean |

```js
const nums = [1, 2, 3, 4];

nums.find(n => n > 2);       // 3   — first element over 2
nums.findIndex(n => n > 2);  // 2   — its index
nums.some(n => n > 3);       // true  — at least one is > 3
nums.every(n => n > 0);      // true  — all are positive
nums.every(n => n > 2);      // false — 1 and 2 fail
```

**Bonus:** `some`/`every` "short-circuit" — `some` stops at the first match, `every` stops at the first failure, so they're efficient.

---

### 60. What are template literals?

**Intuition first.** Template literals are strings written with backticks (`` ` ``) instead of quotes. They give you two superpowers: you can drop variables and expressions straight into the text with `${...}`, and you can write strings that span multiple lines without `\n`.

```js
const name = "Sam";
const items = 3;

const msg = `Hello ${name}, you have ${items} items (${items > 0 ? "some" : "none"}).`;
// "Hello Sam, you have 3 items (some)."

const multiline = `Line one
Line two`;  // real line break, no \n needed
```

**Bonus — tagged templates:** a function placed before the backticks can process the parts, used by libraries like styled-components and for safe escaping: `` tag`Hi ${name}` ``.

---

### 61. What is optional chaining and nullish coalescing?

**Intuition first.** Two operators that make handling "missing data" safe and clean. **Optional chaining (`?.`)** lets you reach deep into an object without crashing if something along the way is missing — it just returns `undefined` instead of throwing. **Nullish coalescing (`??`)** supplies a fallback, but *only* when the value is genuinely "nothing" (`null`/`undefined`), unlike `||` which also fires on `0`, `""`, and `false`.

```js
const user = { address: { city: "Pune" } };

user?.address?.city;     // "Pune"
user?.contact?.email;    // undefined — no crash, even though `contact` is missing
// user.contact.email;   // would throw: Cannot read 'email' of undefined

// ?? vs || — the key difference is how they treat falsy-but-valid values:
const count = 0;
count ?? 10;   // 0   — 0 is a real value, kept
count || 10;   // 10  — || wrongly treats 0 as "missing"

const name = "";
name ?? "Guest"; // ""      — empty string kept
name || "Guest"; // "Guest" — || treats "" as missing
```

**Rule of thumb:** use `??` for defaults when `0`/`""`/`false` are legitimate values; use `||` only when any falsy value should trigger the fallback.

---

### 62. What is the difference between `JSON.stringify` and `JSON.parse`?

**Intuition first.** They're inverse operations — a pair of translators between live JavaScript objects and flat text. You can't send an object over the network or store it in `localStorage`; you must first turn it into a string (`stringify`), and when it comes back you turn the string into an object again (`parse`).

```js
const obj = { name: "Sam", age: 30 };

const text = JSON.stringify(obj);  // '{"name":"Sam","age":30}'  (object → string)
localStorage.setItem("user", text);

const back = JSON.parse(text);     // { name: "Sam", age: 30 }  (string → object)
console.log(back.name);            // "Sam"
```

**Gotchas:** `stringify` silently drops functions, `undefined` values, and `Symbol`s, and converts `Date` objects to ISO strings (which `parse` does *not* turn back into a `Date`). `JSON.parse` on malformed text throws — wrap it in `try/catch`. `stringify` also accepts extra args: a replacer function and an indent count, e.g. `JSON.stringify(obj, null, 2)` for pretty-printing.

---

### 63. What is a generator function?

**Intuition first.** A normal function runs start-to-finish in one go. A **generator** can hit a `yield`, *pause* itself mid-execution (handing a value back to the caller), and later *resume* exactly where it left off — keeping all its local state. It's like a bookmark in a book: you stop, do something else, then continue from the same page. Values are produced lazily, one at a time, only when asked.

```js
function* gen() {
  yield 1;   // pause here, hand back 1
  yield 2;   // resume here next time, hand back 2
  return 3;
}

const g = gen();           // creates an iterator — nothing has run yet
console.log(g.next());     // { value: 1, done: false }
console.log(g.next());     // { value: 2, done: false }
console.log(g.next());     // { value: 3, done: true }
console.log([...gen()]);   // [1, 2] — spread consumes the yielded values
```

**Uses:** producing infinite/lazy sequences (e.g., an ID generator), custom iterables, and as the conceptual basis behind how `async/await` pauses and resumes.

---

### 64. What is the difference between `setTimeout` and `setInterval`?

**Intuition first.** `setTimeout` is a one-shot alarm — it fires your function *once* after a delay. `setInterval` is a repeating alarm — it keeps firing your function on a fixed cadence until you explicitly cancel it.

```js
const t = setTimeout(() => console.log("once"), 1000);   // fires one time after 1s
clearTimeout(t);   // cancel it before it fires

let n = 0;
const i = setInterval(() => {
  console.log(++n);                  // 1, 2, 3, ... every second
  if (n === 3) clearInterval(i);     // stop after 3 — MUST clear or it runs forever
}, 1000);
```

**Common gotcha:** `setInterval` doesn't wait for slow callbacks to finish, so overlapping work can pile up. A safer pattern for repeated *async* work is a recursive `setTimeout` that schedules the next run only *after* the current one completes.

---

### 65. What is memoization?

**Intuition first.** Memoization is "remember the answer so you don't compute it twice." The first time a function is called with some inputs, you compute the result and stash it in a cache keyed by those inputs. Next time the same inputs arrive, you skip the work and return the cached answer instantly. It trades a little memory for a lot of speed on repeated calls.

```js
function memoize(fn) {
  const cache = new Map();              // stores key → result
  return (...args) => {
    const key = JSON.stringify(args);   // turn args into a cache key
    if (cache.has(key)) {
      return cache.get(key);            // cache HIT — instant return
    }
    const result = fn(...args);         // cache MISS — compute once
    cache.set(key, result);             // and remember it
    return result;
  };
}

const slowSquare = (n) => { /* pretend this is expensive */ return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(4); // computes → 16
fastSquare(4); // cached → 16 instantly, no recomputation
```

**Where you've seen it:** React's `useMemo`/`useCallback` and `React.memo` are memoization for renders; classic interview use is speeding up recursive algorithms like Fibonacci. **Caveat:** only memoize *pure* functions (same input → same output, no side effects), or the cache will hand back stale/wrong results.

---
# Section 3 — React

### 66. What is React and what problem does it solve?

**Plain-English intuition:** Imagine you are running a restaurant menu board. The old way (vanilla JavaScript / jQuery) is like manually erasing and rewriting each item by hand every time a price changes — tedious and error-prone, and you must remember *exactly* which letters to erase. React is like having a smart assistant: you simply hand it the *new menu* you want displayed, and it figures out the smallest set of changes needed to update the board for you.

**Technical explanation:** React is a **JavaScript library for building user interfaces** out of reusable, self-contained pieces called **components**. The core problem it solves is **keeping the UI (the DOM) in sync with your data (state)**. In plain JavaScript, when data changes you must manually find and update every affected DOM node — this code grows messy and bug-prone as the app scales.

React flips this with a **declarative** model:
- **Imperative (old way):** "Find this element, change its text, hide that element..." — you describe *how* to update step by step.
- **Declarative (React):** "Given this state, the UI should look like *this*." — you describe *what* it should look like, and React handles the *how*.

When state changes, React re-runs your component, builds a description of the new UI, and efficiently updates only the parts of the real DOM that actually changed (using the **Virtual DOM**).

```jsx
// Declarative: UI is a function of state.
function Counter() {
  const [count, setCount] = useState(0);   // the data (state)
  // We DESCRIBE what the UI should be for the current count.
  // We never manually touch the DOM — React syncs it for us.
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

**Why it matters:** Declarative + component-based code is easier to reason about, test, and reuse. You think about "what state am I in?" instead of "what DOM operation do I run next?"

---

### 67. What is the Virtual DOM and how does reconciliation work?

**Plain-English intuition:** The real DOM is like a heavy, expensive-to-edit physical document. Editing it directly (especially many times) is slow because the browser may re-calculate layout and repaint. The **Virtual DOM** is a cheap *draft copy* kept in memory. React makes all its edits on the draft first, compares the new draft to the old one, and then applies only the *minimal real edits* to the actual document.

**Technical explanation:** The Virtual DOM is a lightweight JavaScript object tree that mirrors the structure of the real DOM. When state changes:

1. React builds a **new** Virtual DOM tree from your components.
2. It **diffs** (compares) the new tree against the previous tree — this process is called **reconciliation**.
3. It computes the **minimal set of real-DOM operations** needed and applies just those.

```
  STATE CHANGES
        |
        v
 ┌──────────────┐   diff    ┌──────────────┐
 │ OLD VDOM tree│  <----->  │ NEW VDOM tree│
 └──────────────┘           └──────────────┘
        |                          |
        └────────► compute minimal changes ◄────────┘
                            |
                            v
              ┌───────────────────────────┐
              │  Patch ONLY changed nodes  │
              │      in the REAL DOM        │
              └───────────────────────────┘
```

**Example of diffing in action:**
```
OLD:  <ul>           NEW:  <ul>
        <li>A</li>           <li>A</li>   ← unchanged, skip
        <li>B</li>           <li>X</li>   ← text changed, update only this
      </ul>                  <li>C</li>   ← new node, insert
                           </ul>
```
React touches only the changed `<li>` and the new one — not the whole list.

**Reconciliation heuristics (how React keeps the diff fast):**
- If two elements are of **different types** (e.g., `<div>` became `<span>`), React tears the old subtree down and builds a fresh one rather than diffing inside.
- For lists, React uses **`key`s** to match items between renders so it can tell what was added, removed, or moved.

A naive tree-diff is O(n³); these heuristics bring React's diff down to roughly **O(n)**.

**Common gotcha:** The Virtual DOM is not *magically* faster than direct DOM manipulation for every case — its value is in *batching* and *minimizing* updates while letting you write simple declarative code.

---

### 68. What are components? Functional vs class components.

**Plain-English intuition:** Components are like LEGO bricks. Each brick is a small, self-contained piece of UI (a button, a card, a navbar). You snap bricks together to build whole pages, and you can reuse the same brick in many places.

**Technical explanation:** A component is a reusable, independent piece of UI that accepts inputs (props) and returns what should appear on screen (JSX). There are two ways to write them:

| | Functional Component | Class Component |
|---|---|---|
| Syntax | Plain JS function returning JSX | ES6 class extending `React.Component` |
| State / lifecycle | **Hooks** (`useState`, `useEffect`) | `this.state`, lifecycle methods |
| `this` keyword | Not needed | Required (binding headaches) |
| Boilerplate | Minimal | More verbose |
| Status | **Modern standard** | Legacy / maintenance |

```jsx
// Functional component (modern, preferred)
function Welcome({ name }) {
  return <h1>Hello {name}</h1>;
}

// Class component (older style, same output)
class Welcome extends React.Component {
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
}
```

**Why functional won:** Hooks (introduced in React 16.8) let functional components do everything classes could — state, side effects, context — without the confusing `this` binding and scattered lifecycle logic. New code should use functional components.

---

### 69. What is JSX?

**Plain-English intuition:** JSX lets you write what *looks like* HTML directly inside your JavaScript. It is a convenience — like writing in your native language instead of translating every sentence by hand. A tool (Babel) does the translation into real JavaScript for you.

**Technical explanation:** JSX is a **syntax extension** for JavaScript. It is *not* HTML and *not* a string — it compiles into `React.createElement(...)` calls, which produce the Virtual DOM objects React works with. JSX is optional but makes UI code far more readable.

```jsx
const el = <h1 className="title">Hi</h1>;

// Babel compiles the line above into:
const el = React.createElement("h1", { className: "title" }, "Hi");
//                              ^tag    ^props object         ^children
```

**Key JSX rules (common interview traps):**
- Use `className` instead of `class` (because `class` is a reserved JS word).
- Use `htmlFor` instead of `for`.
- Event handlers are **camelCase**: `onClick`, `onChange`, not `onclick`.
- Embed JavaScript expressions with `{ }`: `<p>{user.name}</p>`.
- A component must return **one root element** (use a Fragment `<>...</>` to group siblings).
- Self-close tags that have no children: `<img />`, `<br />`.

```jsx
const name = "Sam";
const greeting = <p>{`Hello, ${name}!`}</p>;   // expression inside braces
```

---

### 70. What are props?

**Plain-English intuition:** Props are like the settings you pass to an appliance. You hand a microwave a time and power level; it uses them but cannot change *your* settings. Similarly, a parent component hands data to a child, and the child uses it but must not modify it.

**Technical explanation:** **Props** (short for "properties") are **read-only inputs** passed *from a parent down to a child* component. They make components configurable and reusable. Data flows **one way — top-down** (parent → child), which makes apps predictable: you always know where a value came from.

```
        <App>                      // parent holds the data
          │  passes props ↓
          ▼
      <Button label="Save"         // child RECEIVES props
              onClick={handleSave}/>
```

```jsx
// Parent passes props
function App() {
  return <Button label="Save" onClick={() => alert("saved")} />;
}

// Child reads props (read-only!)
function Button({ label, onClick }) {   // destructured props
  // ❌ label = "Delete"  // NEVER mutate a prop — breaks one-way data flow
  return <button onClick={onClick}>{label}</button>;
}
```

**Rule:** A child must **never mutate its props**. If a child needs to change data, it should call a function passed down via props (like `onClick`) so the *parent* updates its own state. This one-way flow is the backbone of React's predictability.

---

### 71. What is state? Difference between props and state.

**Plain-English intuition:** If props are the settings handed to you by someone else, **state** is your own notepad — private data you own, can change whenever you like, and that causes the UI to refresh when you update it.

**Technical explanation:** **State** is data that is **owned and managed inside a component** and can change over time (e.g., a form's input value, a counter, whether a dropdown is open). When you update state through its setter, React **re-renders** the component to reflect the new value.

| | Props | State |
|---|---|---|
| Who owns it | The **parent** component | The **component itself** |
| Mutable? | **No** (read-only) | **Yes** (via its setter function) |
| Purpose | Configure / pass data to a child | Track data that changes over time |
| Triggers re-render? | When parent passes new props | Yes, when updated via setter |
| Direction | Flows down (parent → child) | Local; can be passed down as props |

```jsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);   // STATE — owned here, can change
  return (
    <button onClick={() => setIsOn(!isOn)}>   // updating state re-renders
      {isOn ? "ON" : "OFF"}
    </button>
  );
}
```

**Mental model:** Props come *in* from outside and are fixed for this render; state lives *inside* and drives change. A value that one component owns as **state** is often passed to a child as a **prop**.

---

### 72. Explain `useState`.

**Plain-English intuition:** `useState` gives a function component a memory slot. Each time the component re-renders, React remembers the latest value you stored, and gives you a button (the setter) to update it. Pressing that button tells React "the data changed — please redraw."

**Technical explanation:** `useState` is a Hook that adds local state to a functional component. It returns an array of exactly two things: the **current value** and a **setter function**. Calling the setter schedules a re-render with the new value.

```jsx
const [count, setCount] = useState(0);
//      ^value  ^setter        ^initial value (used only on first render)

setCount(count + 1);          // direct update
setCount(prev => prev + 1);   // functional update — receives the latest value
```

**Why two forms exist:**
```jsx
// ❌ Direct form can be wrong when batched:
setCount(count + 1);
setCount(count + 1);   // both read the SAME stale `count` → only +1 total

// ✅ Functional updater always uses the freshest value:
setCount(prev => prev + 1);
setCount(prev => prev + 1);   // +2 total, correct
```

**Key points:**
- The initial value passed to `useState` is used **only on the first render**.
- For an expensive initial value, pass a function: `useState(() => heavyCompute())` — this "lazy initializer" runs only once.
- State updates are **asynchronous and batched** (see Q98), so reading state immediately after setting it gives the *old* value.

**Tip:** Whenever the new state depends on the old state, use the **functional updater** form to stay safe from stale values and batching.

---

### 73. Explain `useEffect` thoroughly.

**Plain-English intuition:** Rendering produces what's on screen. But sometimes you need to do something *outside* React's drawing — fetch data, start a timer, subscribe to an event, log analytics. These are **side effects**. `useEffect` is React's way of saying "after you've finished drawing, go run this extra job — and here's how to clean it up when you're done."

**Technical explanation:** `useEffect(callback, deps)` runs side effects **after** the component renders and the screen is painted. It takes a function (the effect) and an optional **dependency array** that controls *when* the effect re-runs. The effect may return a **cleanup function**.

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);   // SET UP the side effect
  return () => clearInterval(id);        // CLEANUP — runs before re-run & on unmount
}, [dependency]);                         // DEPENDENCY ARRAY controls re-runs
```

**Dependency array behavior:**

| Dependency arg | When the effect runs |
|---|---|
| *omitted* (no array) | After **every** render |
| `[]` (empty array) | **Once on mount**; cleanup on unmount |
| `[a, b]` | On mount, and whenever `a` **or** `b` changes (compared by reference) |

**Lifecycle timeline:**
```
MOUNT          UPDATE (a changed)      UPDATE (a changed)      UNMOUNT
  │                   │                       │                   │
  ▼                   ▼                       ▼                   ▼
[effect runs] → [cleanup]→[effect] →   [cleanup]→[effect]  →  [cleanup runs]
```
Notice: before each *re-run* of the effect, React runs the **previous** cleanup first. On unmount, only the cleanup runs.

**Complete example:**
```jsx
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);  // start timer
    return () => clearInterval(id);   // stop timer to prevent memory leak
  }, []);   // [] → set up once on mount, tear down on unmount
  return <p>{time.toLocaleTimeString()}</p>;
}
```

**Why cleanup matters:** Without it, timers keep firing, subscriptions pile up, and fetches resolve on unmounted components — causing memory leaks and warnings.

---

### 74. What are the Rules of Hooks?

**Plain-English intuition:** React keeps track of your hooks by *counting* them in order on each render — like dealing cards in the same sequence every hand. If you sometimes skip a card (call a hook conditionally), the counting gets out of sync and React hands the wrong state to the wrong hook.

**Technical explanation:** There are two non-negotiable rules:

1. **Only call Hooks at the top level** — never inside loops, conditions, or nested functions. React identifies each hook *by the order it's called*, and that order must be identical on every render.
2. **Only call Hooks from React functions** — either function components or other custom Hooks, never from plain JavaScript functions or class components.

```jsx
// ❌ WRONG — conditional hook breaks the call order
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0);   // sometimes called, sometimes not!
  }
}

// ✅ CORRECT — hook always called; put the condition INSIDE
function Good({ show }) {
  const [x, setX] = useState(0);     // always called, stable order
  return show ? <p>{x}</p> : null;
}
```

**Tip:** Enable `eslint-plugin-react-hooks` — it automatically flags violations of these rules and missing effect dependencies.

---

### 75. What is the dependency array and the stale closure problem?

**Plain-English intuition:** Each render is like a photograph that freezes all the variables at that moment. A function created during a render "remembers" the values from *that photo*. If an effect runs with an old photo but you expected the latest values, it behaves on outdated data — that's a **stale closure**.

**Technical explanation:** A **closure** is a function bundled with the variables it referenced when created. In React, every render creates fresh variables, so functions defined in that render close over *that render's* values. If your effect uses a value but you **omit it from the dependency array**, the effect keeps the old closure and never sees updates.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);   // ❌ always logs 0 — closed over the FIRST render's count
    }, 1000);
    return () => clearInterval(id);
  }, []);   // [] → effect never re-runs, so `count` is frozen at 0
}
```

**Fixes:**
```jsx
// Fix 1: include the dependency so the effect re-subscribes with fresh value
useEffect(() => { /* uses count */ }, [count]);

// Fix 2: use the functional updater so you don't need to read `count` at all
setCount(prev => prev + 1);

// Fix 3: use a ref to always hold the latest value (see useRef)
```

**Takeaway:** Include **every** value the effect reads in the dependency array, or restructure (functional updater / refs) so you don't need to. The lint rule will warn you.

---

### 76. Explain `useRef`.

**Plain-English intuition:** `useRef` is a small box that survives every re-render. You can put anything inside it, and changing what's inside **does not** trigger a re-render. It's perfect for two jobs: grabbing a real DOM element, or remembering a value across renders without redrawing.

**Technical explanation:** `useRef(initial)` returns a mutable object shaped like `{ current: initial }`. The same object persists for the component's entire lifetime, and mutating `.current` does **not** cause a re-render (unlike state).

**Use case 1 — access a DOM node directly:**
```jsx
function SearchBox() {
  const inputRef = useRef(null);          // create the box
  useEffect(() => {
    inputRef.current.focus();             // focus the real <input> on mount
  }, []);
  return <input ref={inputRef} />;        // attach box to the DOM element
}
```

**Use case 2 — store a mutable value without re-rendering:**
```jsx
function Timer() {
  const intervalId = useRef(null);        // holds the timer id across renders
  const start = () => {
    intervalId.current = setInterval(tick, 1000);   // store id, no re-render
  };
  const stop = () => clearInterval(intervalId.current);
}
```

**Ref vs State (key distinction):**

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change? | **Yes** | **No** |
| Use for | Data shown in the UI | DOM nodes, timer ids, "previous value", mutable instance data |
| Read/write timing | Value fixed per render | `.current` always reflects latest |

---

### 77. `useMemo` vs `useCallback`.

**Plain-English intuition:** Both are "remember this so I don't redo work." Imagine an expensive calculation — `useMemo` caches the *answer*. `useCallback` caches the *function itself* so its identity stays stable between renders (important so memoized children don't needlessly re-render).

**Technical explanation:** Both memoize based on a dependency array and only recompute when a dependency changes.

- **`useMemo(fn, deps)`** — runs `fn`, **caches its returned value**, and returns the cached value until a dependency changes. Use for expensive computations or to keep object/array references stable.
- **`useCallback(fn, deps)`** — **caches the function reference itself**. Returns the same function instance until a dependency changes.

```jsx
// useMemo: cache an expensive computed VALUE
const sortedList = useMemo(() => bigArray.sort(compare), [bigArray]);
//    ^ recomputed only when bigArray changes

// useCallback: cache a FUNCTION so child wrapped in React.memo doesn't re-render
const handleClick = useCallback(() => doSomething(id), [id]);
//    ^ same function reference until `id` changes
```

**The relationship:** `useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)`.

**When to use which:**
```
Do you want to cache a computed result (number, sorted array, object)?  → useMemo
Do you want to cache a function (to pass to a memoized child)?          → useCallback
```

**Common gotcha:** Don't memoize *everything* — memoization itself has a cost (storing deps, comparing them). Use it for genuinely expensive work or when stabilizing references for `React.memo`.

---

### 78. What is `React.memo`?

**Plain-English intuition:** Normally, when a parent re-renders, all its children re-render too — even if their inputs didn't change. `React.memo` wraps a component and says "skip re-rendering me if my props look the same as last time." It's a smart skip-checker.

**Technical explanation:** `React.memo` is a **higher-order component** that memoizes a functional component. Before re-rendering, React does a **shallow comparison** of the new props against the previous props; if they're equal, it **reuses the previous render output** and skips the work.

```jsx
const Child = React.memo(function Child({ value }) {
  console.log("rendered");       // only logs when `value` actually changes
  return <p>{value}</p>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Child value="static" />    {/* won't re-render despite parent re-rendering */}
    </>
  );
}
```

**The catch — reference equality:** Shallow comparison means objects/arrays/functions are compared by reference. If a parent passes a *new* inline function or object each render, `React.memo` always sees "different props" and re-renders anyway:

```jsx
// ❌ new function every render → React.memo is defeated
<Child onClick={() => save()} />

// ✅ stabilize the reference with useCallback
const onClick = useCallback(() => save(), []);
<Child onClick={onClick} />
```

This is why `React.memo` pairs with `useCallback`/`useMemo` to keep prop references stable.

---

### 79. What is the Context API and when do you use it?

**Plain-English intuition:** Imagine a building's central announcement system. Instead of passing a message person-to-person down every hallway (prop drilling), you broadcast once and anyone tuned in hears it. Context lets deeply nested components "tune in" to shared data without it being handed through every layer.

**Technical explanation:** The Context API shares data **globally across a component subtree without prop drilling**. You create a context, wrap part of the tree in its **Provider** (supplying a value), and any descendant reads it with **`useContext`** — no matter how deep.

```
WITHOUT Context (prop drilling)      WITH Context
   App (theme)                          App ── Provider value={theme}
    └ Page (theme)                        └ Page
       └ Toolbar (theme)                     └ Toolbar
          └ Button uses theme                   └ Button ── useContext(ThemeContext)
   (theme passed through every layer)     (Button reads directly, layers untouched)
```

```jsx
const ThemeContext = createContext("light");   // create context with default

function App() {
  return (
    <ThemeContext.Provider value="dark">   {/* supply the value */}
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);  // reads "dark" directly — no props passed
  return <button className={theme}>Click</button>;
}
```

**Good for:** theme, authenticated user, language/locale — data that's truly global and changes infrequently.

**Caution:** **Every consumer re-renders whenever the Provider's `value` changes.** Don't put rapidly-changing state in a single broad context, or split contexts and memoize the value to limit re-renders.

---

### 80. What is prop drilling and how do you avoid it?

**Plain-English intuition:** Prop drilling is like passing a note from the front of a classroom to the back row — every student in between must hold and pass it along even though only the last person reads it. The middle components don't care about the data; they're just couriers.

**Technical explanation:** **Prop drilling** is passing props through many intermediate components that don't use them, purely to deliver data to a deep descendant. It makes refactoring painful and clutters components with props they don't need.

```jsx
// ❌ Prop drilling: `user` threaded through Page and Sidebar unnecessarily
<App>           user
  <Page user={user}>
    <Sidebar user={user}>
      <Profile user={user} />   // only THIS one needs it
```

**Ways to avoid it:**

| Technique | Best for |
|---|---|
| **Context API** | Global-ish data: theme, auth, locale |
| **State libraries** (Redux, Zustand, Jotai) | Large apps with complex shared state |
| **Component composition** (pass `children`) | Keeping layout flexible without threading props |

```jsx
// Composition fix: parent injects the deep child, no drilling through layers
function Page({ children }) {
  return <main>{children}</main>;
}
<Page><Profile user={user} /></Page>   // Profile gets user directly
```

---

### 81. What are keys in React and why are they important?

**Plain-English intuition:** When you have a list and items get added, removed, or reordered, React needs a way to recognize "this is the same item as before." A **key** is like a name tag on each item — without stable name tags, React can confuse one item for another and update the wrong ones.

**Technical explanation:** `key` is a special prop you put on list elements. During reconciliation, React uses keys to match elements between the old and new tree, so it knows precisely which items were **added, removed, or moved** — preserving state and avoiding unnecessary DOM work. Keys must be **unique among siblings** and **stable** across renders.

```jsx
{users.map(u => <li key={u.id}>{u.name}</li>)}   // ✅ stable unique id
```

**Why index keys break (classic interview point):**
```
Initial:  [🍎(key=0), 🍌(key=1), 🍒(key=2)]
Remove 🍎: [🍌(key=0), 🍒(key=1)]   ← indexes shift!

React thinks key=0 "changed from 🍎 to 🍌" instead of "🍎 removed."
Result: wrong DOM reuse — input values, focus, and component state
        attach to the WRONG rows.
```

**Rule:** Use a unique, stable identifier (a database `id`). Only use the array index as a key when the list is **static, never reordered, and never filtered** — and even then, a real id is safer.

---

### 82. Explain controlled vs uncontrolled components.

**Plain-English intuition:** A **controlled** input is like a puppet — React holds the strings (state) and the input shows exactly what React says. An **uncontrolled** input is like a free agent — the DOM keeps its own value, and React only peeks at it when it needs to (via a ref).

**Technical explanation:**
- **Controlled component** — the input's `value` is bound to React state, and an `onChange` handler updates that state. React is the **single source of truth**. Recommended for most forms (enables validation, conditional disabling, formatting).
- **Uncontrolled component** — the **DOM itself** holds the value. You set an optional `defaultValue` and read the current value via a **ref** only when needed (e.g., on submit).

```
CONTROLLED                          UNCONTROLLED
 user types
    │                                 user types
    ▼                                    │
 onChange → setState                     ▼
    │                                  DOM stores value
    ▼                                    │ (React not involved)
 state → value={state}                   ▼
    │ (React drives input)            ref.current.value (read on demand)
    ▼
 input shows state
```

```jsx
// Controlled — React state drives the input
function ControlledInput() {
  const [name, setName] = useState("");
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// Uncontrolled — DOM holds value, read via ref
function UncontrolledInput() {
  const inputRef = useRef();
  const submit = () => alert(inputRef.current.value);   // read on demand
  return <><input defaultValue="" ref={inputRef} /><button onClick={submit}>Go</button></>;
}
```

**Rule of thumb:** Prefer controlled for predictability; uncontrolled is handy for simple/quick forms or integrating non-React widgets.

---

### 83. What is the component lifecycle (in hooks terms)?

**Plain-English intuition:** A component has three life phases like any living thing: it's **born** (mount), it **grows/changes** (update), and it **dies** (unmount). Hooks let you run code at each phase.

**Technical explanation:** With functional components, lifecycle is expressed through `useEffect` and its cleanup:

| Phase | What happens | Hooks expression | Class equivalent |
|---|---|---|---|
| **Mount** | Component added to DOM (first render) | `useEffect(() => {...}, [])` | `componentDidMount` |
| **Update** | Re-renders due to state/props change | `useEffect(() => {...}, [deps])` | `componentDidUpdate` |
| **Unmount** | Component removed from DOM | cleanup `return () => {...}` | `componentWillUnmount` |

```jsx
function Widget({ id }) {
  useEffect(() => {
    console.log("mounted or id changed");   // runs on mount + when id changes
    return () => console.log("cleanup before next run / on unmount");
  }, [id]);
  return <div>Widget {id}</div>;
}
```

**Timeline:**
```
 MOUNT ──────► UPDATE (deps change) ──────► UNMOUNT
   │                  │                         │
 effect       cleanup → effect             cleanup only
```

---

### 84. How do you fetch data in React?

**Plain-English intuition:** Fetching data is a side effect (it talks to the outside world), so it belongs in `useEffect`. You also want to *cancel* a request if the component disappears before the response arrives — otherwise you try to update a component that's gone.

**Technical explanation:** Put the fetch inside `useEffect`, track loading/error/data in state, and clean up with an `AbortController` to cancel in-flight requests on unmount.

```jsx
function Users() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();   // lets us cancel the fetch
    async function load() {
      try {
        const res = await fetch("/api/users", { signal: controller.signal });
        const json = await res.json();
        setData(json);                           // store result
      } catch (e) {
        if (e.name !== "AbortError") setError(e); // ignore intentional cancels
      }
    }
    load();
    return () => controller.abort();   // cancel request if component unmounts
  }, []);   // [] → fetch once on mount

  if (error) return <p>Error!</p>;
  if (!data) return <p>Loading...</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Best practice:** In real apps, use a data-fetching library like **TanStack Query (React Query)** or **SWR** — they handle caching, deduplication, retries, background refetching, and loading/error states for you, removing tons of boilerplate.

---

### 85. What is lifting state up?

**Plain-English intuition:** If two siblings need to share a piece of information, neither can reach into the other's pocket. So you move the information *up* to their shared parent, who then hands a copy down to each. The parent becomes the single source of truth.

**Technical explanation:** "Lifting state up" means moving state to the **closest common ancestor** of the components that need it, then passing the value down via props and passing setter callbacks down so children can request changes.

```
        Parent  ← state lives here (single source of truth)
        /     \
   value↓     value↓ + onChange↓
      /           \
 ChildA          ChildB
 (displays)      (updates via callback)
```

```jsx
function Parent() {
  const [text, setText] = useState("");        // state lifted to parent
  return (
    <>
      <Input value={text} onChange={setText} /> {/* child updates via callback */}
      <Preview text={text} />                    {/* sibling reads the same state */}
    </>
  );
}
function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
function Preview({ text }) {
  return <p>{text}</p>;
}
```

**Benefit:** One source of truth keeps the siblings perfectly in sync and avoids duplicated, drifting state.

---

### 86. What is reconciliation and the diffing algorithm?

**Plain-English intuition:** Reconciliation is React asking "what changed since last time, and what's the cheapest way to update the screen?" Instead of comparing everything against everything (which is hugely slow), React uses a few smart shortcuts based on realistic assumptions about how UIs change.

**Technical explanation:** **Reconciliation** is the process of comparing the new Virtual DOM tree with the previous one and computing the minimal real-DOM updates. A general tree-diff is O(n³), which is impractical. React applies two **heuristics** to get to ~O(n):

1. **Different element types → replace the whole subtree.** If a node changes from `<div>` to `<span>` (or `ComponentA` to `ComponentB`), React unmounts the old subtree and builds a new one rather than diffing inside.
2. **Lists are matched by `key`.** Keys let React identify which children moved, were added, or removed, instead of re-creating the whole list.

```
Type changed?
  <div>...</div>   →   <span>...</span>
        │
        ▼
  Tear down old subtree entirely, build new one (no inner diff)

Same type?
  <div className="a"> → <div className="b">
        │
        ▼
  Keep the node, update only changed attributes, recurse into children
```

**Why it matters:** Understanding this explains why **changing a component's type or its key** fully resets its state, and why **stable keys** are essential for correct list updates.

---

### 87. Why should you not mutate state directly?

**Plain-English intuition:** React decides whether to re-render by checking "is this a *new* object?" — it compares references (the box's address), not the contents. If you change the contents of the same box without giving a new box, React sees the same address and thinks "nothing changed," so it skips re-rendering.

**Technical explanation:** React uses **reference equality** (`Object.is`) to detect state changes. Mutating an object or array in place (`arr.push(x)`, `obj.key = y`) keeps the **same reference**, so React may not detect a change and **won't re-render**. Always produce a **new** object/array.

```jsx
// ❌ Mutation — same reference, React may not re-render
setItems(prev => { prev.push(newItem); return prev; });

// ✅ New array — new reference, React re-renders
setItems(prev => [...prev, newItem]);

// ✅ New object via spread
setUser(prev => ({ ...prev, age: 30 }));

// ✅ Update one item in a list immutably
setItems(prev => prev.map(it => it.id === id ? { ...it, done: true } : it));
```

**Bonus benefits of immutability:** predictable state, easy undo/redo, and reliable `React.memo` / `useMemo` comparisons (which also rely on reference equality).

---

### 88. What is `useReducer` and when to use it over `useState`?

**Plain-English intuition:** `useState` is great for simple, independent values. But when your state is complex — many related fields, or the next state depends on the action that occurred — managing it with scattered `setState` calls gets messy. `useReducer` centralizes all the "how state changes" logic into one function, like a mini-Redux.

**Technical explanation:** `useReducer(reducer, initialState)` returns the current `state` and a `dispatch` function. You send **actions** (objects describing what happened) to `dispatch`; the **reducer** (a pure function) computes the next state from the current state plus the action.

```jsx
function reducer(state, action) {   // pure: (state, action) -> new state
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset":     return { count: 0 };
    default:          return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

**`useState` vs `useReducer`:**

| Use `useState` when... | Use `useReducer` when... |
|---|---|
| State is simple / independent values | State is complex or has many sub-fields |
| Updates are straightforward | Next state depends on intricate logic/action type |
| Few transitions | Many related transitions you want centralized & testable |

**Bonus:** Reducers are pure and easy to unit test, and pairing `useReducer` with Context is a lightweight alternative to Redux for app-wide state.

---

### 89. What are custom hooks?

**Plain-English intuition:** When you find yourself copy-pasting the same stateful logic (e.g., "track window size," "toggle a boolean," "fetch and cache data") into multiple components, you can extract it into a reusable function — a **custom hook**. It bundles up the logic so any component can plug it in.

**Technical explanation:** A custom hook is a JavaScript function whose **name starts with `use`** and which can call other hooks. It lets you **reuse stateful logic** across components. Importantly, it shares **logic, not state** — each component that calls the hook gets its *own* independent state.

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(o => !o);   // functional updater — safe
  return [on, toggle];                   // expose value + action
}

// Each component gets its OWN independent toggle state:
function Modal() {
  const [isOpen, toggleOpen] = useToggle();
  return <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"}</button>;
}
```

**Why the `use` prefix matters:** It tells React (and the linter) this function follows the Rules of Hooks, so the hook-order checks and dependency warnings apply.

**Common examples:** `useFetch`, `useLocalStorage`, `useDebounce`, `useWindowSize`, `usePrevious`.

---

### 90. What is React Router and how does client-side routing work?

**Plain-English intuition:** In a traditional website, clicking a link asks the server for a brand-new page (a full reload — white flash). In a Single-Page App, React Router intercepts the click, swaps the displayed component, and updates the URL — all without reloading. It feels instant, like flipping pages in an app rather than reloading a website.

**Technical explanation:** **React Router** enables **client-side routing** in a Single-Page Application (SPA). It maps URL paths to components and uses the browser's **History API** (`pushState`) to change the URL and render the matching component without a server round-trip or full page reload.

```jsx
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<User />} />   {/* :id is a URL param */}
      </Routes>
    </BrowserRouter>
  );
}

function User() {
  const { id } = useParams();          // read the dynamic :id from the URL
  const navigate = useNavigate();      // programmatic navigation
  return <button onClick={() => navigate("/")}>User {id} — go home</button>;
}
```

**Key hooks/components:**
- `<Link to="/path">` / `<NavLink>` — declarative navigation (no reload).
- `useParams()` — read dynamic URL segments.
- `useNavigate()` — navigate from code (e.g., after a form submit).
- `useSearchParams()` — read/update query strings.

---

### 91. How do you optimize React performance?

**Plain-English intuition:** Performance work is mostly about **doing less**: don't re-render what didn't change, don't recompute what you already computed, and don't load code you don't need yet.

**Technical explanation:** A toolbox of techniques, roughly from cheapest to most involved:

| Technique | What it prevents |
|---|---|
| **`React.memo`** | Re-rendering a component when its props are unchanged |
| **`useMemo` / `useCallback`** | Recomputing expensive values / unstable function references |
| **Stable `key`s** (avoid index) | Wrong DOM reuse and unnecessary list re-creation |
| **Code splitting** (`React.lazy` + `Suspense`) | Loading the entire app bundle upfront |
| **Virtualization** (`react-window`) | Rendering thousands of off-screen list rows |
| **Keep state local** | Re-rendering large trees for localized changes |
| **Avoid inline objects/arrays/functions** in hot paths | Breaking `React.memo` via new references each render |

```jsx
// Example: stabilize a function + memoize a child to cut re-renders
const onSelect = useCallback(id => setSelected(id), []);
const Row = React.memo(({ item, onSelect }) => (
  <li onClick={() => onSelect(item.id)}>{item.name}</li>
));
```

**Golden rule:** **Measure first** with the React DevTools Profiler. Premature memoization adds complexity and can hurt more than help.

---

### 92. What is code splitting / lazy loading?

**Plain-English intuition:** Instead of shipping the entire app's JavaScript in one giant download before anything shows (slow first load), you split it into chunks and load each chunk only when it's actually needed — like streaming a show instead of downloading the whole series first.

**Technical explanation:** **Code splitting** breaks the bundle into smaller chunks loaded **on demand**. `React.lazy` dynamically imports a component (returning a chunk fetched only when rendered), and `<Suspense>` shows a fallback while that chunk loads.

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));   // separate chunk, loaded on demand

function App() {
  return (
    <Suspense fallback={<Spinner />}>   {/* shown while Dashboard chunk downloads */}
      <Dashboard />
    </Suspense>
  );
}
```

**Common pattern:** Split per **route** so each page's code loads only when the user navigates there — dramatically reducing initial load time.

---

### 93. What are error boundaries?

**Plain-English intuition:** An error boundary is like a circuit breaker. If part of your UI throws an error while rendering, instead of crashing the *entire* app (blank white screen), the breaker trips, isolates the broken section, and shows a friendly fallback message.

**Technical explanation:** An **error boundary** is a component that **catches JavaScript errors anywhere in its child component tree** during rendering, logs them, and displays a fallback UI. They are implemented as **class components** using `getDerivedStateFromError` (to render the fallback) and/or `componentDidCatch` (to log).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };          // update state → render fallback
  }
  componentDidCatch(error, info) {
    logToService(error, info);          // log the error
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

// Usage: wrap a risky subtree
<ErrorBoundary><Widget /></ErrorBoundary>
```

**Important limitations — error boundaries do NOT catch:**
- Errors in **event handlers** (use a normal `try/catch` there).
- Errors in **asynchronous code** (`setTimeout`, promises).
- Errors during **server-side rendering**.
- Errors thrown in the error boundary itself.

**Tip:** The `react-error-boundary` library provides a convenient hook-friendly wrapper since there's no built-in hook version.

---

### 94. What is the difference between `useEffect` and `useLayoutEffect`?

**Plain-English intuition:** Both run side effects, but at different moments relative to when the browser *paints* the screen. `useEffect` runs *after* the user sees the new frame (non-blocking). `useLayoutEffect` runs *before* the paint (blocking) — use it when you must measure or tweak the DOM so the user never sees a flicker.

**Technical explanation:**

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Timing | **After** the browser paints | **After** DOM mutation, **before** paint |
| Blocking? | No (asynchronous) | Yes (synchronous — delays paint) |
| Use for | Most side effects: fetching, subscriptions, logging | Measuring layout, synchronously mutating DOM to avoid visual flicker |

**Timeline:**
```
render → DOM updated → [useLayoutEffect runs] → browser PAINTS → [useEffect runs]
                          (before user sees it)                    (after user sees it)
```

```jsx
// useLayoutEffect: measure DOM before paint to avoid a visible jump
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();  // read layout
  setTooltipTop(height);   // adjust position BEFORE the user sees the frame
}, []);
```

**Rule:** Default to `useEffect`. Reach for `useLayoutEffect` only when you genuinely need to read/write layout before paint, since it blocks rendering and can hurt performance.

---

### 95. What is the difference between state management with Redux vs Context?

**Plain-English intuition:** Context is a built-in megaphone for broadcasting a value to a subtree — simple, but everyone listening re-renders when the value changes. Redux is a dedicated, organized warehouse for app state, with strict rules, tooling, and the ability for components to subscribe only to the slices they care about.

**Technical explanation:**

| | Context API | Redux (Toolkit) |
|---|---|---|
| What it is | Built-in dependency injection / data sharing | Full state-management library |
| Best for | Low-frequency global data (theme, auth, locale) | Large apps with complex, frequently-updated shared state |
| Re-renders | **All** consumers re-render on value change | **Selective** — components subscribe to specific slices |
| Tooling | None | DevTools (time-travel), middleware (thunks/sagas) |
| Boilerplate | Minimal | More (reduced greatly by Redux Toolkit) |

**Key insight:** Context is a *transport mechanism*, not a state manager — it doesn't optimize re-renders or provide tooling. Redux adds predictable centralized state, selective subscriptions (via `useSelector`), middleware for async, and powerful debugging.

**Modern alternatives:** **Zustand** (minimal), **Jotai** (atomic), **Recoil** — lighter than Redux for many apps.

---

### 96. Explain the Redux data flow.

**Plain-English intuition:** Redux enforces a strict one-way loop, like a factory assembly line. The UI can't reach into the warehouse and rearrange shelves directly; it must file a request (an action). A clerk (the reducer) reads the request and produces an updated inventory record (new state). The UI then reflects the updated record.

**Technical explanation:** Redux uses **unidirectional (one-way) data flow**:

```
   ┌──────────────────────────────────────────────┐
   │                                                │
   │   UI (Component)                               │
   │      │  dispatch(action)   { type, payload }   │
   │      ▼                                          │
   │   Reducer  (pure: (state, action) => newState) │
   │      │                                          │
   │      ▼                                          │
   │   Store (single source of truth)               │
   │      │  notifies subscribers via selectors      │
   │      └──────────────► UI re-renders ────────────┘
```

1. The UI **dispatches an action** — a plain object like `{ type: "todos/added", payload: "Buy milk" }`.
2. A **reducer** (pure function) receives the current state + action and **returns a new state** (never mutating the old one).
3. The **store** updates and notifies subscribed components, which re-render with new data (read via **selectors**).

```jsx
// Redux Toolkit slice — the modern standard
const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    added: (state, action) => { state.push(action.payload); },  // Immer makes this safe
  },
});
dispatch(todosSlice.actions.added("Buy milk"));
```

**Redux Toolkit (RTK)** is the recommended approach today: `createSlice` cuts boilerplate, and built-in **Immer** lets you write "mutating" syntax that stays immutable under the hood.

---

### 97. What are React fragments?

**Plain-English intuition:** A component must return a single parent element, but you don't always want an extra wrapper `<div>` cluttering your HTML (extra divs can break CSS grids/flex layouts). A Fragment is an invisible wrapper — it groups elements without adding any node to the DOM.

**Technical explanation:** A **Fragment** (`<>...</>` shorthand, or `<React.Fragment>`) lets you return multiple sibling elements **without adding an extra DOM node**.

```jsx
// ❌ Adds an unnecessary wrapper div to the DOM
return <div><Header /><Main /></div>;

// ✅ Fragment — no extra DOM node
return (
  <>
    <Header />
    <Main />
  </>
);
```

**When you need the long form:** If you're rendering a list of fragments and need to assign a `key`, you must use the explicit form (the shorthand `<>` can't take props):

```jsx
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </React.Fragment>
))}
```

---

### 98. What happens when you call `setState`? Is it synchronous?

**Plain-English intuition:** Calling a state setter is like dropping a request in a suggestion box, not flipping a switch. React doesn't update immediately; it collects all the requests from the current event, then re-renders once with the final result. So if you read the state right after setting it, you still see the *old* value.

**Technical explanation:** The `useState` setter (and class `setState`) is **asynchronous and batched**. Within the same event handler, React **groups multiple updates** and performs a **single re-render** for efficiency. The new value isn't available on the *current* line — only on the *next* render.

```jsx
function handleClick() {
  console.log(count);        // say it's 0
  setCount(count + 1);
  console.log(count);        // STILL 0 — state hasn't updated yet (async/batched)
}
// React re-renders once afterward; next render sees count === 1
```

**Batching consequence (multiple updates):**
```jsx
setCount(count + 1);   // reads stale count = 0 → schedules 1
setCount(count + 1);   // reads SAME stale 0 → schedules 1
// Result: count === 1, NOT 2

// ✅ Functional updater fixes it — each gets the latest:
setCount(c => c + 1);
setCount(c => c + 1);   // Result: count === 2
```

**To react to the new value,** use `useEffect` with the state in the dependency array.

**React 18 note:** Automatic batching now applies **everywhere** — including inside promises, `setTimeout`, and native event handlers (previously only React event handlers batched).

---

### 99. What is Strict Mode?

**Plain-English intuition:** Strict Mode is like a strict code reviewer that only shows up during development. It deliberately runs certain code twice to flush out hidden bugs — like impure functions or effects that forgot to clean up. It produces no visible UI and is automatically off in production.

**Technical explanation:** `<React.StrictMode>` is a **development-only** wrapper that surfaces potential problems. Notably, in development it **double-invokes** certain functions — component render bodies, state initializers, and effects (mount → unmount → mount) — to expose:
- **Impure render logic** (side effects that shouldn't be in render).
- **Missing effect cleanup** (effects that leak because they don't clean up).

```jsx
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Important:** The double-invocation happens **only in development** and only for functions React expects to be pure/idempotent. It renders no DOM and has **zero effect in production builds**. If your effect breaks when run twice, that's a real bug Strict Mode is warning you about.

---

### 100. What are the new React 18 features?

**Plain-English intuition:** React 18's headline upgrade is **concurrency** — the ability to start rendering, pause to handle something more urgent (like a keystroke), and resume later. This keeps apps responsive even during heavy updates.

**Technical explanation:** Key additions:

- **Automatic batching everywhere** — multiple state updates are batched into one re-render even inside promises, timeouts, and native event handlers (not just React events).
- **Concurrent rendering** — React can interrupt, pause, and resume rendering so urgent updates stay snappy.
- **`useTransition` / `startTransition`** — mark updates as **non-urgent** so urgent ones (typing) aren't blocked.
  ```jsx
  const [isPending, startTransition] = useTransition();
  startTransition(() => setSearchResults(filterBigList(query)));  // low priority
  ```
- **`useDeferredValue`** — defer re-rendering of an expensive part using a "lagging" copy of a value.
- **`useId`** — generate stable unique IDs that match between server and client (great for accessibility/SSR).
- **`Suspense` improvements** — better support for data fetching and **streaming SSR**.
- **New root API** — `createRoot(...)` replaces `ReactDOM.render(...)` and unlocks concurrent features.

---

### 101. What is server-side rendering (SSR) and how does Next.js help?

**Plain-English intuition:** With normal React (client-side rendering), the browser downloads a near-empty page plus a big JS bundle, *then* builds the UI — slow first paint and poor SEO (crawlers see little). **SSR** has the *server* build the full HTML first and send it ready-to-display, so users see content immediately.

**Technical explanation:** **Server-Side Rendering** runs your React components on the **server** for each request, producing complete HTML that's sent to the browser. The user sees content fast (better **First Contentful Paint** and **SEO**), then React **hydrates** the static HTML — attaching event listeners to make it interactive.

```
CLIENT-SIDE RENDERING          SERVER-SIDE RENDERING
 server → empty HTML + JS        server → full HTML (built on server)
 browser runs JS → builds UI     browser shows content immediately
 (slow first paint, weak SEO)    then hydrates → interactive (fast, SEO-friendly)
```

**Next.js** is the leading React framework that provides, out of the box:
- **SSR** (render per request),
- **SSG** (Static Site Generation — pre-render at build time),
- **ISR** (Incremental Static Regeneration — rebuild static pages periodically),
- **File-based routing**, **API routes**, **image optimization**, and (in the App Router) **React Server Components**.

---

### 102. What is hydration?

**Plain-English intuition:** SSR sends a "photograph" of your UI — it looks right but the buttons don't work yet. **Hydration** is React waking that static photo up: it reuses the existing HTML and attaches all the event listeners and state, turning the picture into a fully interactive app.

**Technical explanation:** **Hydration** is the client-side process where React takes server-rendered static HTML and **attaches event handlers and internal state to the existing markup**, rather than recreating the DOM from scratch. React walks the existing HTML, matches it against what its components would render, and "adopts" the nodes.

```jsx
import { hydrateRoot } from "react-dom/client";

// On the client: attach React to the server-rendered HTML (reuse, don't rebuild)
hydrateRoot(document.getElementById("root"), <App />);
```

**Common gotcha — hydration mismatch:** If the server-rendered HTML differs from what the client renders (e.g., using `Date.now()`, `window`, or random values during render), React logs a hydration warning and may discard the server HTML. Keep render output deterministic and identical on both sides.

---

### 103. How do you handle forms in React?

**Plain-English intuition:** A form is just inputs whose values you need to track and validate. The simplest approach ties each input to React state (controlled). For bigger forms, dedicated libraries handle validation, errors, and performance for you so you don't reinvent the wheel.

**Technical explanation:** Two main approaches:

1. **Controlled inputs with `useState`** — React state is the source of truth; good for small forms.
   ```jsx
   function LoginForm() {
     const [email, setEmail] = useState("");
     const submit = (e) => { e.preventDefault(); console.log(email); };
     return (
       <form onSubmit={submit}>
         <input value={email} onChange={e => setEmail(e.target.value)} />
         <button>Submit</button>
       </form>
     );
   }
   ```

2. **Form libraries** for complex forms:
   - **React Hook Form** — performant (uses uncontrolled inputs + refs under the hood, minimizing re-renders), minimal boilerplate.
   - **Formik** — popular, full-featured.
   - Both pair with schema validators like **Zod** or **Yup** for declarative validation.

   ```jsx
   import { useForm } from "react-hook-form";
   function Form() {
     const { register, handleSubmit } = useForm();
     return (
       <form onSubmit={handleSubmit(data => console.log(data))}>
         <input {...register("email")} />   {/* registers the field, no manual state */}
         <button>Submit</button>
       </form>
     );
   }
   ```

**Rule of thumb:** Controlled `useState` for simple forms; React Hook Form + Zod for anything with real validation or many fields.

---

### 104. What is the `children` prop?

**Plain-English intuition:** `children` is whatever you nest *inside* a component's tags. It lets a component act like a picture frame — it provides the frame (styling, layout) and you slot any content inside. This is the heart of **composition**: building flexible, reusable wrappers.

**Technical explanation:** `props.children` is a special prop containing whatever JSX you place between a component's opening and closing tags. It enables **component composition** — generic wrappers (cards, modals, layouts) that don't care what's inside them.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;   // renders whatever is passed in
}

// Anything between the tags becomes `children`:
<Card>
  <h2>Title</h2>
  <p>Some content</p>
</Card>
```

**Why it's powerful:** Composition via `children` keeps components reusable and avoids prop drilling — instead of a component needing to know all the data its content requires, you just hand it the finished content.

---

### 105. Common interview "gotcha": why does my counter show the wrong value in `setTimeout`/closures?

**Plain-English intuition:** Each render takes a "snapshot" of your variables. A callback created during a render remembers the values from *that* snapshot forever. So a `setTimeout` scheduled in one render still uses that render's (now outdated) `count` when it fires later — that's a **stale closure**.

**Technical explanation:** When you schedule a callback (timeout, interval, event listener) inside a render, it **closes over** that render's `count` value. By the time it runs, the state may have changed, but the callback still references the old captured value.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      // ❌ This `count` is the value from the render when handleClick was created
      setCount(count + 1);   // if clicked rapidly, all use the SAME stale count
    }, 1000);
  };
  return <button onClick={handleClick}>{count}</button>;
}
```

**Fixes:**
```jsx
// Fix 1: functional updater — always uses the LATEST state, ignores the stale capture
setCount(c => c + 1);

// Fix 2: useRef to hold the latest value
const countRef = useRef(count);
countRef.current = count;        // keep ref in sync each render
setTimeout(() => setCount(countRef.current + 1), 1000);
```

**Takeaway:** Whenever a delayed/async callback needs the current state, prefer the **functional updater** (`setCount(c => c + 1)`) or a **ref** — never rely on the captured state variable directly.

---
# Section 4 — TypeScript

### 106. What is TypeScript and why use it over JavaScript?
**Plain-English intuition:** Imagine JavaScript is a recipe written entirely from memory — you only find out you grabbed salt instead of sugar after you taste the finished cake (at runtime). TypeScript is like having labels on every ingredient jar *before* you cook. If you reach for the wrong one, it stops you immediately. TypeScript doesn't change the cake (the JavaScript that actually runs); it just adds a safety layer while you're writing it.

**Technical explanation:** TypeScript is a **strongly-typed superset of JavaScript** developed by Microsoft. "Superset" means every valid JavaScript program is already a valid TypeScript program — you can rename a `.js` file to `.ts` and it (mostly) works. On top of JS, TypeScript adds a **static type system** that is checked at **compile time** by the TypeScript compiler (`tsc`), which then **transpiles** your code down to plain JavaScript that browsers and Node can run.

**Benefits:**
- **Catch errors early** — type mismatches, typos in property names, and wrong argument counts surface while you type, not in production.
- **Better tooling** — autocomplete, safe rename/refactor, go-to-definition, and inline documentation (IntelliSense) all work because the editor *knows* the shapes of your data.
- **Self-documenting** — a function signature like `(user: User) => Token` tells you exactly what goes in and comes out.
- **Safer refactoring at scale** — change a type in one place and the compiler points to every spot that now breaks.

```ts
function greet(name: string) {
  return "Hello, " + name.toUpperCase();
}

greet("Rajveer"); // ✅ compiles → "Hello, RAJVEER"
greet(42);        // ❌ Compile error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**Key point (the one to say out loud):** types are **erased at compile time** — they do **not** exist in the output JavaScript and add **zero runtime overhead**. The browser never sees a single type annotation.

---

### 107. What are the basic (primitive) types in TypeScript?
**Intuition:** These are the "starter LEGO bricks." Most complex types are built by combining these.

```ts
let id: number = 5;              // all numbers: ints, floats, hex, etc.
let username: string = "Rajveer";
let isActive: boolean = true;
let list: number[] = [1, 2, 3];           // array of numbers
let alsoList: Array<number> = [1, 2, 3];  // identical, generic syntax
let tuple: [string, number] = ["age", 30]; // FIXED length & types, position matters
let anything: any = "could be anything";    // opts OUT of type checking (avoid)
let safe: unknown = fetchData();            // unknown, must be narrowed before use
let nothing: null = null;
let u: undefined = undefined;
let big: bigint = 100n;          // integers beyond Number.MAX_SAFE_INTEGER
let sym: symbol = Symbol("id");  // unique identifiers
```

**Gotcha — tuples vs arrays:** a tuple `[string, number]` enforces both the **order** and the **length**. `tuple = [30, "age"]` is an error because position 0 must be a `string`. A plain `number[]` has no length limit and one element type.

---

### 108. What is the difference between `any`, `unknown`, `never`, and `void`?
**Intuition:**
- `any` = "I give up on safety here, let me do anything." (the escape hatch)
- `unknown` = "I don't know the type *yet* — force me to check before I touch it." (the safe escape hatch)
- `void` = "this function returns nothing useful." (think `console.log`)
- `never` = "this point in code is impossible to reach / this value can't exist." (think a function that always throws)

| Type | Can assign anything TO it? | Can you USE it freely? | Typical use |
|---|---|---|---|
| `any` | ✅ Yes | ✅ Yes (no checks — unsafe) | Escape hatch / migrating JS (avoid) |
| `unknown` | ✅ Yes | ❌ No — must narrow first | Safe handling of external/unknown data |
| `void` | only `undefined` | n/a | Return type of functions that return nothing |
| `never` | ❌ Nothing is assignable to it | n/a | Functions that throw/never return; exhaustiveness checks |

```ts
function fail(msg: string): never { throw new Error(msg); } // never returns normally
function log(msg: string): void { console.log(msg); }       // returns nothing useful

let val: unknown = getData();
// val.toUpperCase();        ❌ Error — 'val' is of type 'unknown'
if (typeof val === "string") {
  val.toUpperCase();         // ✅ now narrowed to string, safe to use
}
```

**`never` for exhaustiveness (a favorite interview trick):**
```ts
type Shape = "circle" | "square";
function area(s: Shape) {
  switch (s) {
    case "circle": return 1;
    case "square": return 2;
    default:
      const _exhaustive: never = s; // ✅ compiles ONLY if every case is handled
      return _exhaustive;           // if you add "triangle" later, this line errors → reminds you
  }
}
```

---

### 109. What is the difference between `interface` and `type`?
**Intuition:** Both describe "the shape data should have." Think of `interface` as a **blueprint that can be reopened and extended** (great for objects and public APIs), and `type` as a **flexible alias** that can name *anything* — a union, a primitive, a tuple, a computed type — not just object shapes.

| Feature | `interface` | `type` |
|---|---|---|
| Describe object shapes | ✅ | ✅ |
| Extend / inherit | `extends` (also `implements` by classes) | via `&` (intersection) |
| **Declaration merging** (reopen & add) | ✅ Yes | ❌ No (duplicate name = error) |
| Union types (`A \| B`) | ❌ | ✅ |
| Primitives / tuples / literals | ❌ | ✅ |
| Mapped & conditional types | ❌ | ✅ |
| Performance on huge unions | slightly better caching | fine |

```ts
// Declaration merging — interface can be "reopened":
interface User { name: string; }
interface User { age: number; }   // ✅ merges → User = { name: string; age: number }

// type CANNOT do this:
type Animal = { legs: number };
// type Animal = { tail: boolean };  ❌ Error: Duplicate identifier 'Animal'

// But ONLY type can do these:
type ID = string | number;          // union — interface can't
type Pair = [string, number];       // tuple
type Size = "sm" | "md" | "lg";     // literal union
```

**Rule of thumb:** use `interface` for object shapes (especially public/extendable APIs and class contracts); use `type` for unions, intersections, primitives, tuples, and anything computed.

---

### 110. What are union and intersection types?
**Intuition (think sets):**
- **Union (`|`)** = "this OR that." The value can be **any one** of the listed types. A union is the *combination of possibilities*, but you can only safely use what they have in **common** until you narrow.
- **Intersection (`&`)** = "this AND that." The value must satisfy **all** types at once, so it has **every** property combined.

```
Union  A | B :  value is A OR B          (more possible values, fewer shared props)
Intersection A & B : value is A AND B    (fewer possible values, MORE props)
```

```ts
type Status = "loading" | "success" | "error"; // union of string literals
let s: number | string;
s = 5;     // ✅
s = "hi";  // ✅
// s = true; ❌ boolean is not in the union

type A = { x: number };
type B = { y: number };
type C = A & B;            // intersection → { x: number; y: number }
const c: C = { x: 1, y: 2 }; // ✅ must have BOTH x and y
```

**Common gotcha:** with a union, you can only access properties shared by *all* members until you narrow:
```ts
function f(v: A | B) {
  // v.x;  ❌ x might not exist (if v is B)
  if ("x" in v) v.x; // ✅ narrowed to A
}
```

---

### 111. What are literal types?
**Intuition:** Instead of saying "this is *a* string," you say "this is *exactly* the string `"up"`." Literal types pin a value to one specific constant. They become powerful when combined with unions to model a fixed set of allowed values (like an enum, but lighter).

```ts
let direction: "up" | "down" | "left" | "right";
direction = "up";      // ✅
direction = "north";   // ❌ Error: not one of the allowed literals

// Real-world: HTTP methods
type Method = "GET" | "POST" | "PUT" | "DELETE";
function request(url: string, method: Method) {}
request("/api", "PATCH"); // ❌ caught at compile time — typo-proof
```

**Why useful:** the editor autocompletes the allowed values, and typos become compile errors instead of silent bugs.

---

### 112. What is type inference?
**Intuition:** You don't have to spell out every type. TypeScript watches the value you assign and **figures out the type for you** — like a smart assistant filling in the obvious blanks.

```ts
let count = 5;            // inferred as: number
const names = ["a", "b"]; // inferred as: string[]
// count = "hi";          ❌ Error — count was inferred as number

const point = { x: 1, y: 2 }; // inferred: { x: number; y: number }

function double(n: number) {
  return n * 2;           // return type inferred as: number
}
```

**`let` vs `const` widening (subtle but interview-worthy):**
```ts
let a = "hi";    // inferred as string (widened — it can be reassigned)
const b = "hi";  // inferred as the literal type "hi" (it can never change)
```

**Best practice:** rely on inference for obvious local variables; **do** annotate function parameters, return types of public functions, and exported/API boundaries for clarity and safety.

---

### 113. What are generics and why are they useful?
**Intuition:** A generic is a **type placeholder** — like a variable, but for types. It lets one function or component work with *many* types while **remembering** which type was used, so you keep full type safety instead of falling back to `any`.

**Before generics (you lose type info):**
```ts
function identityBad(value: any): any { return value; }
const r = identityBad("hi"); // r is 'any' → no autocomplete, no safety
r.toFixed(2);                 // compiles, but CRASHES at runtime (string has no toFixed)
```

**After generics (type is preserved):**
```ts
function identity<T>(value: T): T { return value; }
//                ↑ T captures whatever type comes in, and the SAME T comes out

const a = identity<string>("hi"); // T = string → a is string
const b = identity(42);           // T inferred as number → b is number
// a.toFixed();  ❌ Error — TS knows a is string. The bug is caught at compile time.
```

**Generic interface (the React/API pattern):**
```ts
interface ApiResponse<T> {
  data: T;
  status: number;
}
const res: ApiResponse<User[]> = { data: users, status: 200 };
// res.data is fully typed as User[] — autocomplete on res.data[0].name works
```

Without generics you'd either lose type info (`any`) or duplicate the same function for every type.

---

### 114. What are generic constraints?
**Intuition:** A plain `<T>` accepts literally any type, so inside the function you know *nothing* about it. A **constraint** (`T extends Something`) says "T can be any type, *as long as* it has these features," which lets you safely use those features.

```ts
function getLength<T extends { length: number }>(item: T): number {
  return item.length;   // ✅ safe — the constraint guarantees a .length exists
}

getLength("hello");    // ✅ 5  (string has length)
getLength([1, 2, 3]);  // ✅ 3  (array has length)
getLength(123);        // ❌ Error: number has no 'length' property
```

**Constraint with `keyof` (very common):**
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];     // return type is exactly the type of that property
}
const user = { id: 1, name: "Sam" };
getProp(user, "name"); // ✅ returns string
getProp(user, "age");  // ❌ "age" is not a key of user
```

---

### 115. What are optional, readonly, and default properties?
**Intuition:** These let you describe "this might not be here" (`?`), "this can be set once but never changed" (`readonly`), and "use this value if none is given" (default parameter).

```ts
interface User {
  name: string;
  age?: number;          // OPTIONAL — its type is actually number | undefined
  readonly id: number;   // READONLY — can be set at creation, never reassigned
}

const u: User = { name: "Sam", id: 1 }; // ✅ age omitted, that's fine
u.id = 2;     // ❌ Error: Cannot assign to 'id' because it is read-only
u.age = 30;   // ✅ optional, can be set later

function greet(name: string = "Guest") { // DEFAULT parameter
  return `Hi, ${name}`;
}
greet();        // "Hi, Guest"
greet("Asha");  // "Hi, Asha"
```

**Gotcha:** `readonly` is a **compile-time** guard only. In the emitted JavaScript the property is fully writable — it just stops *you* from writing buggy code.

---

### 116. What are enums?
**Intuition:** An enum is a named set of related constants — instead of scattering "magic numbers/strings," you give them readable names.

```ts
enum Direction { Up, Down, Left, Right } // numeric: Up=0, Down=1, Left=2, Right=3
let d: Direction = Direction.Up;         // d === 0

enum Status { Active = "ACTIVE", Inactive = "INACTIVE" } // string enum
let st: Status = Status.Active;          // "ACTIVE"
```

**Key difference from most TS types:** enums are **NOT fully erased** — a regular `enum` generates a real JavaScript object at runtime. This is unusual, because almost everything else in TS disappears after compilation.

**Modern tip (say this to score points):** many teams prefer a **union of string literals** or an `as const` object instead, because they're zero-runtime-cost and avoid enum quirks:
```ts
type Status2 = "active" | "inactive";           // lightweight alternative
const Color = { Red: "red", Blue: "blue" } as const;
type Color = typeof Color[keyof typeof Color];   // "red" | "blue"
```
(A `const enum` is also fully inlined/erased, but has its own caveats with certain build setups.)

---

### 117. What is the difference between type assertion (`as`) and type casting?
**Intuition:** A type assertion is you telling the compiler "trust me, I know what this is." It is **not** a runtime conversion — unlike casting in languages like Java/C#, it changes **nothing** about the actual value; it only changes how TypeScript *treats* it during type checking.

```ts
const input = document.getElementById("name") as HTMLInputElement;
input.value; // ✅ TS now treats it as an input element (getElementById returns HTMLElement | null)

const len = (someValue as string).length;
// Alternative angle-bracket syntax: (<string>someValue).length
//   → AVOID in .tsx files because <...> clashes with JSX
```

**Why "casting" is the wrong word:** real casting (e.g. `(int)x`) converts data at runtime. `as` does no conversion — `("5" as unknown as number)` does not make `"5"` a number; it just silences the compiler and can hide real bugs.

**Best practice:** use `as` sparingly (DOM access, narrowing `unknown` after you've verified). Prefer real **type narrowing** with `typeof`/`in`/type guards instead.

---

### 118. What is type narrowing?
**Intuition:** You start with a broad type (e.g. "string or number") and, using a runtime check, TypeScript **narrows** it down to a specific type *inside that branch* — so it knows exactly which methods are safe.

```ts
function print(value: string | number) {
  if (typeof value === "string") {
    value.toUpperCase(); // ✅ here TS knows value is string
  } else {
    value.toFixed(2);    // ✅ here TS knows value is number
  }
}
```

**Narrowing tools and what they're for:**

| Tool | Narrows by checking | Example |
|---|---|---|
| `typeof` | JS primitive type | `typeof x === "string"` |
| `instanceof` | class instance | `x instanceof Date` |
| `in` | property existence | `"bark" in animal` |
| equality / truthiness | specific value / null | `if (x) {}`, `x === null` |
| custom **type guard** | `x is Type` predicate | `if (isCat(x))` |

---

### 119. What is a type guard?
**Intuition:** Sometimes a simple `typeof` check isn't enough (e.g. distinguishing two object shapes). A type guard is a **function whose return type is a special "type predicate"** (`param is Type`) that teaches TypeScript how to narrow.

```ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

// The return type "animal is Cat" is the magic — it tells TS what a true result means
function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function speak(a: Cat | Dog) {
  if (isCat(a)) {
    a.meow();  // ✅ narrowed to Cat
  } else {
    a.bark();  // ✅ narrowed to Dog (the only remaining option)
  }
}
```

**Why not just return `boolean`?** If `isCat` returned plain `boolean`, TypeScript wouldn't connect the `true` result to "it's a Cat," and `a.meow()` would error. The `is` predicate is what carries that knowledge.

---

### 120. What are utility types? Name the most important ones.
**Intuition:** Utility types are **built-in generic "type transformers"** — they take an existing type and produce a new, modified one, so you don't hand-rewrite shapes. Each comment below shows the **resulting type** so you can *see* the transformation.

```ts
interface User { id: number; name: string; email: string; }

type T1 = Partial<User>;            // { id?: number; name?: string; email?: string }
type T2 = Required<Partial<User>>;  // { id: number; name: string; email: string }
type T3 = Readonly<User>;           // { readonly id: number; readonly name: string; readonly email: string }
type T4 = Pick<User, "id" | "name">;// { id: number; name: string }
type T5 = Omit<User, "email">;      // { id: number; name: string }
type T6 = Record<string, number>;   // { [key: string]: number }
type T7 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"   (remove from union)
type T8 = Extract<"a" | "b", "a" | "z">; // "a"         (keep only matching)
type T9 = NonNullable<string | null | undefined>; // string

function makeUser(id: number, name: string) { return { id, name }; }
type T10 = ReturnType<typeof makeUser>;  // { id: number; name: string }
type T11 = Parameters<typeof makeUser>;  // [id: number, name: string]
type T12 = Awaited<Promise<string>>;     // string  (unwraps the promise)
```

| Utility | What it does |
|---|---|
| `Partial<T>` | makes all properties optional |
| `Required<T>` | makes all properties required |
| `Readonly<T>` | makes all properties readonly |
| `Pick<T, K>` | keeps only keys `K` |
| `Omit<T, K>` | removes keys `K` |
| `Record<K, V>` | object with keys `K`, values `V` |
| `Exclude<U, X>` | remove `X` from union `U` |
| `Extract<U, X>` | keep only members of `U` in `X` |
| `ReturnType<F>` | the return type of function `F` |

**Most asked:** `Partial`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`.

---

### 121. What is the difference between `interface extends` and intersection (`&`)?
**Intuition:** Both **compose** types together. `extends` is interface-only inheritance (like a class extending a base class); `&` is a `type`-level merge. For plain object shapes they produce essentially the same result.

```ts
interface Animal { name: string; }
interface Dog extends Animal { breed: string; } // Dog = { name: string; breed: string }

type AnimalT = { name: string };
type DogT = AnimalT & { breed: string };         // { name: string; breed: string }
```

**Key behavioral difference on conflicts:**
- With `extends`, if a child redeclares a property with an **incompatible** type, TS reports a clear **error** at the interface.
- With `&`, conflicting primitive properties don't error at declaration — they silently collapse to `never` (e.g. `{ x: number } & { x: string }` makes `x: never`), which is confusing.

**Rule of thumb:** prefer `extends` for object inheritance (clearer errors, better tooling); use `&` when working with `type` aliases or combining computed/union types.

---

### 122. What are mapped types?
**Intuition:** A mapped type is a "for-each loop over the keys of a type." You take every key of `T` and produce a transformed version — this is exactly how `Partial`, `Readonly`, etc. are built internally.

```ts
interface User { id: number; name: string; }

type MyPartial<T>   = { [K in keyof T]?: T[K] };          // make every prop optional
type MyReadonly<T>  = { readonly [K in keyof T]: T[K] };  // make every prop readonly
type Stringify<T>   = { [K in keyof T]: string };         // turn every value into string

type P = MyPartial<User>;    // { id?: number; name?: string }
type R = MyReadonly<User>;   // { readonly id: number; readonly name: string }
type S = Stringify<User>;    // { id: string; name: string }
```

**How to read `{ [K in keyof T]: ... }`:**
- `keyof T` → a union of T's keys, e.g. `"id" | "name"`.
- `K in ...` → iterate over each key, binding it to `K`.
- `T[K]` → the type of the value at that key (an "indexed access type").

**Bonus (key remapping with `as`):**
```ts
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
type G = Getters<{ name: string }>; // { getName: () => string }
```

---

### 123. What are conditional types?
**Intuition:** A conditional type is an "if/else for types" — `T extends U ? X : Y` reads as "if T is assignable to U, pick X, otherwise pick Y."

```ts
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

type NonNull<T> = T extends null | undefined ? never : T;
type C = NonNull<string | null>; // string  (null filtered out)
```

**`infer` — extract a type from inside another (powerful, interview gold):**
```ts
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
//                                          ↑ capture whatever Promise wraps
type D = UnwrapPromise<Promise<number>>; // number
type E = UnwrapPromise<string>;          // string (not a Promise → returned as-is)
```

**Gotcha — distribution:** when the checked type is a *naked* union type parameter, the condition is applied to **each member separately** then re-unioned:
```ts
type ToArray<T> = T extends any ? T[] : never;
type F = ToArray<string | number>; // string[] | number[]  (NOT (string | number)[])
```

---

### 124. What are `keyof` and `typeof` in TypeScript?
**Intuition:**
- `keyof` answers "what are the property names of this type?" → a union of its keys.
- `typeof` (in a *type* position) answers "what is the type of this existing value?" → it lets you derive a type *from* a runtime value instead of writing it twice.

```ts
interface User { id: number; name: string; }
type UserKeys = keyof User;     // "id" | "name"

const config = { port: 3000, host: "localhost" };
type Config = typeof config;    // { port: number; host: string }
type Keys = keyof typeof config;// "port" | "host"  (combine the two!)
```

**Combined for type-safe property access (the canonical pattern):**
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];   // ✅ return type is EXACTLY the type of that property
}
const u = { id: 1, name: "Sam" };
const name = getProp(u, "name"); // typed as string
getProp(u, "nope");              // ❌ "nope" is not a key of u
```

---

### 125. What is the `as const` assertion?
**Intuition:** Normally TS "widens" your literals — `"dark"` becomes `string`, `[1,2]` becomes `number[]`. `as const` tells TS "freeze this exactly as written": make it **deeply readonly** and keep the **narrow literal types**.

```ts
const sizes = ["sm", "md", "lg"] as const;
// type: readonly ["sm", "md", "lg"]  — a readonly tuple, NOT string[]

type Size = typeof sizes[number]; // "sm" | "md" | "lg"  (index into the tuple)

const config = { mode: "dark" } as const;
// config.mode has type "dark" (a literal), NOT string
// config.mode = "light"; ❌ Error — deeply readonly
```

**Why it matters:** `as const` is the bridge from runtime values to precise literal-union types — extremely handy for deriving types from constant config objects/arrays (often paired with `typeof ...[number]` or `keyof typeof`).

---

### 126. What are index signatures?
**Intuition:** When you don't know the property names ahead of time (a dictionary/map of dynamic keys), an index signature says "any key of this kind maps to a value of this type."

```ts
interface StringMap {
  [key: string]: string;   // ANY string key → a string value
}
const colors: StringMap = { primary: "#fff", secondary: "#000" };
colors.tertiary = "#888";  // ✅ allowed — key wasn't predeclared

interface ScoreBoard {
  [player: string]: number;
}
const scores: ScoreBoard = { alice: 10, bob: 7 };
```

**Gotcha:** with an index signature, accessing a missing key still type-checks as the value type (e.g. `colors.missing` is typed `string`) even though it's actually `undefined` at runtime — enable `noUncheckedIndexedAccess` in tsconfig to make TS add `| undefined` and force a check.

---

### 127. What is the non-null assertion operator (`!`)?
**Intuition:** The `!` is you promising the compiler "this value is definitely not `null` or `undefined`, take my word for it." It removes `null`/`undefined` from the type — but only at compile time; it does **nothing** at runtime.

```ts
const el = document.getElementById("app")!; // getElementById returns HTMLElement | null
el.innerHTML = "Hi"; // ✅ '!' stripped the null, so this compiles
```

**Risk:** if the element genuinely *is* null, you get a runtime `TypeError` — the `!` just hid the warning. Prefer a real check:
```ts
const el = document.getElementById("app");
if (el) el.innerHTML = "Hi"; // ✅ safe — narrowed instead of asserted
```
Reach for `!` only when you're certain (and the compiler can't see it), e.g. a ref you know is mounted.

---

### 128. What is the difference between `unknown` and `any` (practical interview answer)?
**Intuition:** Both can hold any value, but they treat *trust* oppositely. `any` says "do whatever you want, no questions asked" (unsafe). `unknown` says "you can store anything here, but you must prove what it is before you use it" (safe).

```ts
let a: any = 10;
a.foo.bar;   // ✅ compiles — but CRASHES at runtime (no real .foo)

let b: unknown = 10;
// b.foo;    ❌ compile error — 'b' is of type 'unknown'
if (typeof b === "number") {
  b.toFixed(2); // ✅ allowed only after narrowing
}
```

| | `any` | `unknown` |
|---|---|---|
| Accept any value | ✅ | ✅ |
| Use without checking | ✅ (unsafe) | ❌ (must narrow) |
| Catches bugs | ❌ | ✅ |
| Spreads through code | ✅ "infects" types | ❌ contained |

**Best practice:** prefer `unknown` for any value of uncertain shape — `JSON.parse(...)`, `catch (e)`, API responses — then narrow before use.

---

### 129. What are function overloads?
**Intuition:** Sometimes one function should accept different input shapes and you want the *return type* to depend on which input was given. Overloads let you declare several public signatures sitting above a single implementation.

```ts
// Overload signatures (what callers see):
function format(value: string): string;
function format(value: number): string;
// Implementation signature (hidden from callers; must cover all overloads):
function format(value: string | number): string {
  return typeof value === "string" ? value.trim() : value.toFixed(2);
}

format("  hi ");  // ✅ matches the string overload
format(3.14159);  // ✅ matches the number overload
format(true);     // ❌ Error — no overload accepts boolean
```

**Gotcha:** the implementation signature is **not** callable directly — callers can only use the declared overloads. Each overload must be compatible with the implementation.

---

### 130. How does TypeScript work with React? (MERN-relevant)
**Intuition:** TypeScript types the three things React passes around: **props** (inputs to a component), **state/refs** (hook values), and **events**. Hooks are generic, so you tell them what type they hold.

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;        // optional prop
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// Hooks are generic — pass the value's type:
const [user, setUser] = useState<User | null>(null); // can be User or null
const inputRef = useRef<HTMLInputElement>(null);      // ref to an input element

// Event typing — the event object is fully typed:
const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  setName(e.target.value); // e.target.value is known to be a string
```

**Tip:** `useState(0)` infers `number` automatically — only pass the generic (`useState<...>()`) when inference isn't enough, e.g. a value that starts `null` but later holds an object.

---

### 131. What is `tsconfig.json` and what is `strict` mode?
**Intuition:** `tsconfig.json` is the compiler's settings file — it tells `tsc` *which* files to compile, *which* JavaScript version to output, *how* modules work, and *how strict* to be about types.

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",        // JS version to emit
    "module": "ESNext",        // module system
    "strict": true,            // turn ON all strict checks at once
    "outDir": "./dist",
    "esModuleInterop": true
  }
}
```

**`"strict": true`** is a master switch enabling several checks, the most important being:
- `strictNullChecks` — `null`/`undefined` are no longer silently assignable to other types; you must handle them explicitly (this alone prevents a huge class of crashes).
- `noImplicitAny` — errors when TS would otherwise fall back to `any`.
- `strictFunctionTypes`, `strictBindCallApply`, `alwaysStrict`, and more.

**Always recommended for new projects** — it catches the most bugs and forces clearer code.

---

### 132. What is declaration merging?
**Intuition:** If you declare two `interface`s (or namespaces) with the **same name**, TypeScript **merges** them into one combined declaration. This is the mechanism behind safely *augmenting* existing/third-party types without editing their source.

```ts
interface Box { width: number; }
interface Box { height: number; }
// merged → Box = { width: number; height: number }

const b: Box = { width: 10, height: 20 }; // ✅ both required

// Real-world: augment the global Window to add your own property
declare global {
  interface Window {
    myGlobal: string;
  }
}
window.myGlobal = "hello"; // ✅ now type-safe
```

**Note:** only `interface` (and `namespace`) merge — duplicate `type` aliases are an error. This is one practical reason libraries expose interfaces.

---

### 133. What is the difference between compile-time and runtime in TypeScript?
**Intuition:** Think of two stages. **Compile time** is while `tsc` reads your `.ts` and checks types — this is the *only* time types exist. **Runtime** is when the resulting `.js` actually runs in the browser/Node — by then every type annotation has been **erased** and is gone.

```
  YOUR CODE (.ts)            tsc compiles            OUTPUT (.js) runs
  ┌──────────────────┐      ───────────────►       ┌──────────────────┐
  │ const x: number  │   types CHECKED, then        │ const x = 5;     │  ← no types!
  │   = 5;           │   ERASED from output         │                  │
  │ interface User{} │                              │ (nothing emitted)│
  └──────────────────┘                              └──────────────────┘
        compile time                                       runtime
```

Because types don't exist at runtime, you **cannot** check a TS type at runtime:
```ts
// ❌ Won't work — interfaces don't exist at runtime
// if (value instanceof MyInterface) {}

// ✅ Runtime checks must use real JavaScript constructs:
if (typeof value === "string") {}
if ("name" in value) {}
if (value instanceof Date) {}        // classes DO exist at runtime
```

**For validating external data** (API responses, form input) where you need runtime guarantees, use a schema library like **Zod** or **Yup** — they check at runtime *and* infer the TS type for you.

---

### 134. What are abstract classes and access modifiers?
**Intuition:** Access modifiers control **who can see** a class member; an `abstract` class is a **partial blueprint** that can't be instantiated on its own — it defines what subclasses must build.

**Access modifiers:**

| Modifier | Visible where | Notes |
|---|---|---|
| `public` (default) | everywhere | the default if you write nothing |
| `private` | only inside the same class | TS-enforced (use `#field` for true JS runtime privacy) |
| `protected` | the class + its subclasses | not from outside instances |
| `readonly` | (not visibility) can't be reassigned after init | combine with the above |

```ts
abstract class Shape {
  constructor(protected name: string) {} // "parameter property" — declares & assigns this.name
  abstract area(): number;               // no body — subclasses MUST implement it
  describe() { return `${this.name}: ${this.area()}`; } // shared concrete method
}

class Circle extends Shape {
  constructor(private radius: number) { super("circle"); }
  area() { return Math.PI * this.radius ** 2; } // ✅ implements the abstract method
}

// const s = new Shape("x"); ❌ Error — cannot instantiate an abstract class
const c = new Circle(2);
c.describe();  // ✅ "circle: 12.566..."
// c.radius;   ❌ Error — radius is private
```

---

### 135. Common interview gotcha — why prefer `unknown`/generics over `any`?
**Intuition:** `any` is contagious. The moment a value is `any`, everything derived from it also becomes `any`, and TypeScript quietly stops checking — so you keep all the syntax of TS but lose the entire benefit.

```ts
const data: any = JSON.parse(raw);
const user = data.user;     // user is 'any' — the infection spreads
user.doAnything();          // compiles, may crash at runtime
```

**The better tools keep flexibility WITHOUT losing safety:**
- **`unknown`** forces you to narrow/validate before use — safe handling of uncertain values.
- **Generics** stay flexible across many types while *preserving* the exact type relationship (input type flows to output).

```ts
const data: unknown = JSON.parse(raw);
// data.user;  ❌ must validate first → bug surfaces at compile time
```

**Why this scores points:** saying this shows you understand the *purpose* of TypeScript — type safety — not just its syntax. `any` defeats that purpose; `unknown` and generics uphold it.

---

## Quick Last-Minute Checklist

- **HTML/CSS:** semantic tags, box model, `border-box`, Flexbox vs Grid, position values, specificity, centering, units (`rem` vs `em`), stacking contexts, margin collapse.
- **JS:** `let/const`, closures, `this`, event loop (micro vs macro), Promises & `async/await`, `map/filter/reduce`, spread/rest, destructuring, debounce/throttle, prototypal inheritance, pass-by-value vs reference.
- **React:** Virtual DOM/reconciliation, props vs state, `useState`/`useEffect` (deps + cleanup), `useMemo`/`useCallback`/`React.memo`, Context, keys, controlled components, performance optimization, hooks rules, stale closures.
- **TypeScript:** `interface` vs `type`, union/intersection, generics + constraints, `any` vs `unknown` vs `never`, utility types (`Partial`/`Pick`/`Omit`/`Record`), type narrowing & type guards, `keyof`/`typeof`, `as const`, strict mode, types are compile-time only (erased at runtime).

**Good luck — speak with examples, lead with the intuition, and when unsure, explain your reasoning out loud.**
