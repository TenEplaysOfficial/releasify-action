const https = require("https");
const core = require("@actions/core");

jest.mock("@actions/core", () => ({
  getInput: jest.fn((key) => {
    const mockInputs = {
      webhook: "https://discord.com/api/webhooks/test/test",
      title: "",
      footer: "",
      username: "",
      avatar_url: "",
      color: "#ff5733",
      mention: "@everyone",
      thumbnail: "",
      image: "",
    };
    return mockInputs[key];
  }),
}));

describe("Discord Webhook Script", () => {
  const mockWrite = jest.fn();
  const mockEnd = jest.fn();
  const mockOn = jest.fn();
  const mockRequest = jest.fn((options, callback) => {
    callback({ statusCode: 204, on: mockOn });
    return {
      write: mockWrite,
      end: mockEnd,
      on: jest.fn(),
    };
  });

  beforeAll(() => {
    process.env.GITHUB_REPOSITORY = "test/repo";
    process.env.GITHUB_EVENT = JSON.stringify({
      release: {
        tag_name: "v1.2.3",
        html_url: "https://github.com/test/repo/releases/v1.2.3",
        body: "Release notes",
        published_at: "2025-07-02T12:00:00Z",
        target_commitish: "main",
        assets: [
          {
            name: "binary.zip",
            browser_download_url:
              "https://github.com/test/repo/releases/download/v1.2.3/binary.zip",
          },
        ],
        zipball_url: "https://github.com/test/repo/zipball/v1.2.3",
        tarball_url: "https://github.com/test/repo/tarball/v1.2.3",
        author: {
          login: "tenedev",
          html_url: "https://github.com/tenedev",
          avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
        },
      },
    });

    https.request = mockRequest;

    require("../index");
  });

  it("sends the correct payload to Discord", () => {
    expect(mockRequest).toHaveBeenCalledTimes(1);
    const sentPayload = JSON.parse(mockWrite.mock.calls[0][0]);

    expect(sentPayload.username).toBe("RBot");
    expect(sentPayload.content).toContain("@everyone");
    expect(sentPayload.embeds[0].title).toContain("🚀 New Release");
    expect(sentPayload.embeds[0].fields[0].name).toBe("Source Code");
    expect(sentPayload.embeds[0].fields[1].value).toContain("compare");
  });
});
