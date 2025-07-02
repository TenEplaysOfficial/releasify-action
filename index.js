const https = require("https");
const core = require("@actions/core");

// GitHub metadata
const github = JSON.parse(process.env.GITHUB_EVENT || "{}");
const repo = process.env.GITHUB_REPOSITORY || "unknown/repo";
const release = github.release || {};
const tag = release.tag_name || "v?.?";
const url = release.html_url || `https://github.com/${repo}`;
const body = release.body || "_No release notes provided._";
const publishedAt = release.published_at || new Date().toISOString();
const commitish = release.target_commitish || "main";
const assets = release.assets || [];

const author = release.author || {};
const authorName = author.login || "unknown";
const authorProfile = author.html_url || `https://github.com/${authorName}`;
const authorAvatar =
  author.avatar_url || "https://github.githubassets.com/favicons/favicon.png";

// Input variables
const webhook = core.getInput("webhook");
const title =
  core.getInput("title") || `🚀 New Release: \`${tag}\` in \`${repo}\``;
const footer = core.getInput("footer") || repo;
const username =
  core.getInput("username") || repo.split("/")[1]?.[0]?.toUpperCase() + "Bot";
const avatar_url =
  core.getInput("avatar_url") ||
  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
const colorHex = core.getInput("color") || "7289da";
const color = parseInt(colorHex.replace(/^#/, ""), 16);
const mention = core.getInput("mention") || "";
const thumbnail = core.getInput("thumbnail");
const image = core.getInput("image");

// Source code links
const zip = release.zipball_url || `https://github.com/${repo}/zipball/${tag}`;
const tar = release.tarball_url || `https://github.com/${repo}/tarball/${tag}`;
const assetLinks = assets.map(
  (asset) => `[${asset.name}](${asset.browser_download_url})`
);
const sourceLinks = [...assetLinks, `[ZIP](${zip})`, `[TAR](${tar})`]
  .filter(Boolean)
  .join(" | ");

// Construct Discord payload
const embedObject = {
  title,
  url,
  description: body,
  color,
  timestamp: publishedAt,
  footer: {
    text: footer,
  },
  author: {
    name: authorName,
    url: authorProfile,
    icon_url: authorAvatar,
  },
  fields: [
    {
      name: "Source Code",
      value: sourceLinks || "No downloads found.",
      inline: false,
    },
    {
      name: "Compare Changes",
      value: `[Compare commits](https://github.com/${repo}/compare/${commitish}...${tag})`,
      inline: false,
    },
  ],
};

if (thumbnail) embedObject.thumbnail = { url: thumbnail };
if (image) embedObject.image = { url: image };

const payload = JSON.stringify({
  username,
  avatar_url,
  content: `${mention} ${title}`.trim(),
  embeds: [embedObject],
});

// Send to Discord
const urlObj = new URL(webhook);
const options = {
  method: "POST",
  hostname: urlObj.hostname,
  path: urlObj.pathname + urlObj.search,
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  console.log(`✅ Discord webhook response: ${res.statusCode}`);
  res.on("data", (d) => process.stdout.write(d));
});

req.on("error", (error) => {
  console.error("❌ Webhook failed:", error);
});

req.write(payload);
req.end();
