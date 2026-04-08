export interface UserPayload {
	id: string;
	email: string;
	role: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: UserPayload;
}
