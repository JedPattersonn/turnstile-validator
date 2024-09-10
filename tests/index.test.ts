import TurnstileValidator from "../src/index";

global.fetch = jest.fn() as jest.Mock;

describe("TurnstileValidator", () => {
  const secretKey = "test_secret_key";
  const validator = new TurnstileValidator(secretKey);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validate throws error if token is not provided", async () => {
    await expect(validator.validate("")).rejects.toThrow("Token is required");
  });

  test("validate calls Cloudflare API with correct parameters", async () => {
    const token = "test_token";
    const mockResponse = {
      success: true,
      challenge_ts: "2023-01-01T00:00:00Z",
      hostname: "example.com",
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await validator.validate(token);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: expect.any(URLSearchParams),
      })
    );

    const calledBody = new URLSearchParams(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    );
    expect(calledBody.get("secret")).toBe(secretKey);
    expect(calledBody.get("response")).toBe(token);
  });

  test("validate includes clientIp when provided", async () => {
    const token = "test_token";
    const clientIp = "127.0.0.1";
    const mockResponse = {
      success: true,
      challenge_ts: "2023-01-01T00:00:00Z",
      hostname: "example.com",
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await validator.validate(token, clientIp);

    const calledBody = new URLSearchParams(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    );
    expect(calledBody.get("remoteip")).toBe(clientIp);
  });

  test("validate returns API response data", async () => {
    const token = "test_token";
    const mockResponse = {
      success: true,
      challenge_ts: "2023-01-01T00:00:00Z",
      hostname: "example.com",
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await validator.validate(token);

    expect(result).toEqual(mockResponse);
  });

  test("validate throws error on API failure", async () => {
    const token = "test_token";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(validator.validate(token)).rejects.toThrow(
      "Turnstile verification failed: HTTP error! status: 400"
    );
  });

  test("validate throws error on network failure", async () => {
    const token = "test_token";
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    await expect(validator.validate(token)).rejects.toThrow(
      "Turnstile verification failed: Network Error"
    );
  });
});
