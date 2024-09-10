interface TurnstileResponse {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    error_codes?: string[];
    action?: string;
    cdata?: string;
}
declare class TurnstileValidator {
    private secretKey;
    private verifyUrl;
    constructor(secretKey: string);
    validate(token: string, clientIp?: string): Promise<TurnstileResponse>;
}
export default TurnstileValidator;
