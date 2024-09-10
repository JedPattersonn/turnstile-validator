interface TurnstileResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
  action?: string;
  cdata?: string;
}

class TurnstileValidator {
  private secretKey: string;
  private verifyUrl: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
    this.verifyUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  }

  async validate(token: string, clientIp?: string): Promise<TurnstileResponse> {
    if (!token) {
      throw new Error("Token is required");
    }

    const data = new URLSearchParams({
      secret: this.secretKey,
      response: token,
    });

    if (clientIp) {
      data.append("remoteip", clientIp);
    }

    try {
      const response = await fetch(this.verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Turnstile verification failed: ${error.message}`);
      }
      throw new Error("Turnstile verification failed: Unknown error");
    }
  }
}

export default TurnstileValidator;
