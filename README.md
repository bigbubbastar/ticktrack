# Sedaris ticket watcher

Checks the Eventbrite checkout page every 10 minutes via GitHub Actions. When the phrase "Sold out" disappears, the workflow fails on purpose — and GitHub emails you automatically (that's the notification mechanism).

## Setup

1. **Confirm GitHub will email you on failures.** Visit https://github.com/settings/notifications and make sure under "Actions" you have "Send notifications for failed workflows only" (or "all") with email enabled. This is on by default for most accounts.

2. **Push this folder to a new GitHub repo** (public is recommended — unlimited Action minutes, and nothing sensitive is in the code):
   ```bash
   cd sedaris-watcher
   git init && git add . && git commit -m "init"
   gh repo create sedaris-watcher --public --source=. --push
   ```

3. **Trigger a test run:**
   ```bash
   gh workflow run "Check Sedaris tickets"
   gh run watch
   ```
   The first run should pass (still sold out). To verify the email path: temporarily change `SOLD_OUT_PHRASE` in `check.js` to `xyz123nope`, push, run again — it'll "fail" and you should get an email within a minute or two.

4. **Stop it later:** disable the workflow in the repo's Actions tab, or delete the repo.

## Notes

- GitHub's cron is best-effort and can lag 5–15 min. Fine for tickets.
- The email comes from `notifications@github.com` with subject like `[your-username/sedaris-watcher] Run failed: Check Sedaris tickets`. The run logs will show the link to the event.
- If you want richer email (custom subject, click-through link in body), swap to a send-email Action like [`dawidd6/action-send-mail`](https://github.com/dawidd6/action-send-mail) with a Gmail app password — happy to wire that up if you want.
