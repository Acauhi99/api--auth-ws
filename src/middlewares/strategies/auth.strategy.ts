export interface AuthStrategy {
  authenticate(token: string): Promise<any>;
}
