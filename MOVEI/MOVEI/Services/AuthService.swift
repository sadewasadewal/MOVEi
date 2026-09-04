//
//  AuthService.swift
//  MOVEI
//

import SwiftUI
import Combine

@MainActor
public final class AuthService: ObservableObject {
    public static let shared = AuthService()

    @Published public var currentUser: Profile?
    @Published public var isAuthenticated: Bool = false
    @Published public var currentRole: UserRole = .customer
    @Published public var isLoading: Bool = false
    @Published public var errorMessage: String?

    private init() {
        // Automatically restore session or initialize demo customer
        loadSavedUser()
    }

    private func loadSavedUser() {
        if let data = UserDefaults.standard.data(forKey: "movei_cached_profile"),
           let profile = try? JSONDecoder().decode(Profile.self, from: data) {
            self.currentUser = profile
            self.currentRole = profile.role
            self.isAuthenticated = true
        } else {
            // Default initial state: Customer (Sandew)
            let defaultCustomer = Profile(
                id: UUID(uuidString: "11111111-2222-3333-4444-555555555555")!,
                fullName: "Sandew",
                avatarURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
                phone: "+94 77 123 4567",
                role: .customer
            )
            self.currentUser = defaultCustomer
            self.currentRole = .customer
            self.isAuthenticated = true
        }
    }

    public func signIn(email: String, password: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        // In a live Supabase configuration with auth endpoint:
        // Here we validate and assign roles based on credentials or demo shortcuts
        try? await Task.sleep(for: .milliseconds(400))

        let role: UserRole
        let name: String
        if email.lowercased().contains("admin") {
            role = .admin
            name = "Cinema Director (Admin)"
        } else if email.lowercased().contains("scanner") || email.lowercased().contains("staff") {
            role = .scanner
            name = "Staff Scanner (Entrance 04)"
        } else {
            role = .customer
            name = email.components(separatedBy: "@").first?.capitalized ?? "Movie Fan"
        }

        let profile = Profile(id: UUID(), fullName: name, avatarURL: nil, phone: nil, role: role)
        saveProfile(profile)
        return true
    }

    public func register(fullName: String, email: String, password: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        try? await Task.sleep(for: .milliseconds(400))
        let profile = Profile(id: UUID(), fullName: fullName, role: .customer)
        saveProfile(profile)
        return true
    }

    public func switchDemoRole(to role: UserRole) {
        let name: String
        switch role {
        case .customer: name = "Sandew (Customer)"
        case .scanner: name = "Gate Scanner 04 (Staff)"
        case .admin: name = "Cinema Admin"
        }
        let profile = Profile(id: UUID(), fullName: name, role: role)
        saveProfile(profile)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }

    public func signOut() {
        currentUser = nil
        isAuthenticated = false
        currentRole = .customer
        UserDefaults.standard.removeObject(forKey: "movei_cached_profile")
        SupabaseManager.shared.clearSession()
    }

    private func saveProfile(_ profile: Profile) {
        self.currentUser = profile
        self.currentRole = profile.role
        self.isAuthenticated = true
        if let data = try? JSONEncoder().encode(profile) {
            UserDefaults.standard.set(data, forKey: "movei_cached_profile")
        }
    }
}
