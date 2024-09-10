"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TurnstileValidator {
    constructor(secretKey) {
        this.secretKey = secretKey;
        this.verifyUrl =
            "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    }
    async validate(token, clientIp) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Turnstile verification failed: ${error.message}`);
            }
            throw new Error("Turnstile verification failed: Unknown error");
        }
    }
}
exports.default = TurnstileValidator;
