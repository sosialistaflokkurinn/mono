"use client";

import { createContext, type ReactNode, use } from "react";

import type { ServerUser } from "./server-auth.ts";

interface AuthContextValue {
	user: ServerUser | null;
	isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// React 19 hook using use() for context consumption
export function useAuth(): AuthContextValue {
	const context = use(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
	initialUser: ServerUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
	const contextValue: AuthContextValue = {
		user: initialUser,
		isAuthenticated: !!initialUser,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Hook for getting user initials for avatar
export function useUserInitials(): string {
	const { user } = useAuth();

	if (!user) {
		return "";
	}

	return user.name
		.split(" ")
		.map((name) => name[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}
