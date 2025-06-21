# Releasify

**Send rich, beautiful GitHub release announcements to Discord — automatically.**

## Features

- Automatically detects release metadata (`tag`, `body`, `assets`, etc.)
- Supports custom titles, footers, usernames, avatars, and colors
- Converts attached release assets into download links
- Posts clean, embedded release messages directly to your Discord server
- Optional: mentions, thumbnails, and body images

## Usage

Add this to your GitHub Actions workflow:

```yaml
- name: Notify Discord
  uses: teneplaysofficial/releasify@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "🚀 New Release!"
    footer: "Published by CI"
    username: "ReleaseBot"
    avatar_url: "https://cdn.example.com/bot-avatar.png"
```

## Inputs

| Input        | Default                           | Description                                                 | Required |
| ------------ | --------------------------------- | ----------------------------------------------------------- | -------- |
| `webhook`    | –                                 | Your **Discord webhook URL**                                | Yes      |
| `title`      | 🚀 `New Release: <tag> in <repo>` | Title text for the embed header                             | No       |
| `footer`     | `<repository name>`               | Footer text at the bottom of the embed                      | No       |
| `username`   | `<RepoName>Bot`                   | Bot name shown in the webhook message                       | No       |
| `avatar_url` | GitHub logo                       | Bot avatar image URL                                        | No       |
| `color`      | `#7289da`                         | Embed accent color (hex code)                               | No       |
| `mention`    | –                                 | Mention users, roles, or everyone (e.g., `@here`, `<@&id>`) | No       |
| `thumbnail`  | –                                 | Embed thumbnail image URL (top-right)                       | No       |
| `image`      | –                                 | Main image displayed at the bottom of the embed             | No       |

## How to Create a Discord Webhook

1. Open **Server Settings** in your Discord server.
2. Navigate to **Integrations → Webhooks**.
3. Click **New Webhook**.
4. Choose:

   - A target channel (where messages will appear)
   - Optional: Name and avatar

5. Click **Copy Webhook URL** (e.g., `https://discord.com/api/webhooks/...`)

## Add the Webhook to GitHub Secrets

1. Go to **GitHub Repo → Settings → Secrets and Variables → Actions**
2. Click **New repository secret**
3. Add:

   - **Name:** `DISCORD_WEBHOOK`
   - **Value:** Paste your Discord Webhook URL

## How It Works

- When a new GitHub **release** is published:

  1. This Action triggers automatically on the tag
  2. It builds a styled Discord embed message using release info
  3. It sends the embed to your Discord channel using your webhook

## Example Output on Discord

When triggered, you'll see a styled embed message like:

```
🚀 New Release: v1.2.3 in my-repo
- Includes release notes
- Download links: [dist.zip](...), [TAR](...), etc.
- Author: @username
```

_With optional thumbnails and preview image if provided_

## License

Licensed under the [MIT License](./LICENSE).
