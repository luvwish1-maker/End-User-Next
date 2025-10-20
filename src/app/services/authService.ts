import api from "../lib/axios";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    message: string;
    data: {
        access_token: string;
        user: User;
    };
}

class AuthService {
    private tokenKey = "access_token";
    private userKey = "user";

    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/auth/login", { email, password });

        if (response.data.data.access_token) {
            localStorage.setItem(this.tokenKey, response.data.data.access_token);
            localStorage.setItem(this.userKey, JSON.stringify(response.data.data.user));
        }

        return response.data;
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    getToken(): string | null {
        return typeof window !== "undefined" ? localStorage.getItem(this.tokenKey) : null;
    }

    getUser(): User | null {
        if (typeof window === "undefined") return null;
        const user = localStorage.getItem(this.userKey);
        return user ? (JSON.parse(user) as User) : null;
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payloadBase64 = token.split(".")[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch {
            return true;
        }
    }

    async signup(data: { email: string; password: string }) {
        return api.post("/auth/register", data);
    }
}

export const authService = new AuthService();
