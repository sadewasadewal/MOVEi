//
//  ProfileView.swift
//  MOVEI
//

import SwiftUI

public struct ProfileView: View {
    @ObservedObject private var auth = AuthService.shared
    @ObservedObject private var ticketService = TicketService.shared

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Avatar & Info
                    VStack(spacing: 10) {
                        ZStack {
                            Circle()
                                .fill(AppTheme.ink)
                                .frame(width: 80, height: 80)
                            Image(systemName: "person.crop.circle.fill")
                                .font(.system(size: 80))
                                .foregroundStyle(AppTheme.lime)
                        }

                        VStack(spacing: 4) {
                            Text(auth.currentUser?.fullName ?? "Movie Fan")
                                .font(.title3.weight(.bold))

                            HStack(spacing: 6) {
                                Image(systemName: auth.currentRole.badgeIcon)
                                Text(auth.currentRole.title.uppercased())
                            }
                            .font(.system(size: 10, weight: .black))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.ink)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(AppTheme.lime, in: Capsule())
                        }
                    }
                    .padding(.top, 14)

                    // Stats row
                    HStack(spacing: 12) {
                        ProfileStatTile(value: "\(ticketService.upcomingTickets.count)", title: "Active Passes")
                        ProfileStatTile(value: "\(ticketService.watchedTickets.count)", title: "Watched")
                        ProfileStatTile(value: "3", title: "Cinemas")
                    }
                    .padding(.horizontal, 20)

                    // Role Switcher for seamless testing across personas
                    VStack(alignment: .leading, spacing: 12) {
                        Text("SWITCH ROLE / PERSONA")
                            .font(.caption.weight(.bold))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.muted)

                        VStack(spacing: 1) {
                            RoleRow(title: "Customer Persona", subtitle: "Book tickets, wallet, collectibles", role: .customer, current: auth.currentRole)
                            Divider()
                            RoleRow(title: "Cinema Scanner Staff", subtitle: "Camera scanner, ticket verification", role: .scanner, current: auth.currentRole)
                            Divider()
                            RoleRow(title: "Platform Administrator", subtitle: "KPIs, movie publishing, shows, cinemas", role: .admin, current: auth.currentRole)
                        }
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 18))
                    }
                    .padding(.horizontal, 20)

                    // Sign Out
                    Button {
                        auth.signOut()
                    } label: {
                        Text("Sign Out")
                            .font(.subheadline.weight(.bold))
                            .foregroundStyle(AppTheme.danger)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
                .padding(.bottom, 32)
            }
            .background(AppTheme.canvas.ignoresSafeArea())
            .navigationTitle("Profile")
        }
    }
}

private struct ProfileStatTile: View {
    let value: String
    let title: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2.weight(.bold))
                .foregroundStyle(AppTheme.ink)
            Text(title)
                .font(.caption2.weight(.medium))
                .foregroundStyle(AppTheme.muted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

private struct RoleRow: View {
    let title: String
    let subtitle: String
    let role: UserRole
    let current: UserRole

    var body: some View {
        Button {
            AuthService.shared.switchDemoRole(to: role)
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(AppTheme.ink)
                    Text(subtitle)
                        .font(.caption2)
                        .foregroundStyle(AppTheme.muted)
                }
                Spacer()
                if role == current {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(AppTheme.lime)
                }
            }
            .padding(14)
        }
    }
}
