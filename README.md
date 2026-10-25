# Silver Rail Children's Fund — website

Static site. No build step. Edit the HTML, push, done.

Pages: `index.html`, `parents.html`, `oregon-crime-victims-compensation.html` (CVC parent guide; update the "Last updated" line, `dateModified` in the JSON-LD, and `sitemap.xml` when it changes), `board.html`, `volunteer.html`, `kaylub.html`, `pizza-day.html`. Every page carries the same nav block; when you add a page, add its link to each one.

## Deploy to GitHub Pages (one time, ~10 min)

1. **Create the repo.** On github.com → New repository → name it `silverrailchildrensfund` → Public → Create. Don't add a README (one is here already).
2. **Upload the files.** On the empty repo page click "uploading an existing file" → drag in `index.html`, `CNAME`, `README.md` → Commit.
3. **Turn on Pages.** Repo → Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. **Set the custom domain.** Still in Settings → Pages → Custom domain: `silverrailchildrensfund.org` → Save. (The `CNAME` file already matches, so GitHub won't fight you.) Check "Enforce HTTPS" once it becomes available — usually within an hour of DNS resolving.

## Point the Squarespace domain at GitHub (one time, ~5 min + propagation)

In Squarespace → Domains → silverrailchildrensfund.org → DNS Settings. Delete any existing A or CNAME records for `@` and `www`, then add:

| Type  | Host | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | `<your-github-username>.github.io` |

Leave the Squarespace MX records alone if you set up email there.

Propagation is usually 15–60 min, occasionally a few hours. Test with `https://silverrailchildrensfund.org`.

## Redirect domains

For `silverrailkids.org` and `silverrailkids.com`: in Squarespace → Domains → that domain → Forwarding → forward to `https://silverrailchildrensfund.org` (permanent/301).

## Email

The site uses `hello@silverrailchildrensfund.org`. Set that up as a Squarespace/Google Workspace mailbox or a forward before the site goes live, or change the address in `index.html` (search for `hello@`).

## Updating the site

Edit `index.html` directly on GitHub (pencil icon) → Commit. Pages redeploys in about a minute.

Things that will need updating as they happen:
- "Oregon nonprofit — filed" → "incorporated" when the state approval email arrives
- 501(c)(3) status line + footer legal text when the IRS determination letter arrives
- The ledger table: add a link to the monthly ledger once the first one is published
