import { ObjectId } from "mongoose";

export enum UserRole {
	USER = "USER",
	MODERATOR = "MODERATOR",
	ADMIN = "ADMIN",
	DEVELOPER = "DEVELOPER",
}

export interface SocialLinks {
	facebook?: string;
	twitter?: string;
	github?: string;
	linkedin?: string;
	website?: string;
}

export interface IUser {
	_id?: ObjectId;
	username: string;
	email: string;
	password: string;
	fullName?: string;
	avatar?: string | ObjectId;
	role: UserRole;
	coin: number;
	level: number;
	xp: number;
	maxXp: number;
	bio?: string;
	cover?: string | ObjectId;
	socialLinks?: SocialLinks;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserPublic {
	id: string;
	username: string;
	email: string;
	fullName?: string;
	avatar?: string;
	role: UserRole;
	coin: number;
	level: number;
	xp: number;
	maxXp: number;
	bio?: string;
	cover?: string;
	socialLinks?: SocialLinks;
	createdAt?: Date;
}

export interface IUserUpdate {
	fullName?: string;
	avatar?: string;
	bio?: string;
	cover?: string;
	socialLinks?: SocialLinks;
}

export interface UserQuery {
	page?: number;
	limit?: number;
	search?: string;
	role?: UserRole;
}
