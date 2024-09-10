# turnstile-validator

A TypeScript validator for Cloudflare Turnstile tokens.

## Installation

```bash
npm install turnstile-validator
```

## Usage

```typescript
import TurnstileValidator from "turnstile-validator";

const validator = new TurnstileValidator("your_secret_key");

async function validateToken(token: string, clientIp?: string) {
  try {
    const result = await validator.validate(token, clientIp);
    console.log(result);
    // { success: true, challenge_ts: '2023-01-01T00:00:00Z', hostname: 'example.com', ... }
  } catch (error) {
    console.error("Validation failed:", error.message);
  }
}

validateToken("user_response_token", "127.0.0.1");
```

## API

### `new TurnstileValidator(secretKey: string)`

Creates a new validator instance.

- `secretKey`: Your Cloudflare Turnstile secret key

### `validator.validate(token: string, clientIp?: string): Promise<TurnstileResponse>`

Validates a Turnstile token.

- `token`: The user response token from the Turnstile widget
- `clientIp`: (Optional) The IP address of the user

Returns a Promise that resolves to the Cloudflare API response.

## TurnstileResponse Interface

```typescript
interface TurnstileResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
  action?: string;
  cdata?: string;
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build the package: `npm run build`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
