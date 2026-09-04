//
//  AdminScannerManagerView.swift
//  MOVEI
//

import SwiftUI

public struct AdminScannerManagerView: View {
    @ObservedObject private var cinemaService = CinemaService.shared
    @State private var scanners: [ScannerStaff] = [
        ScannerStaff(id: "1", name: "Kamal Perera", email: "kamal@cinemax.lk", assignedCinema: "Cinemax Colombo", status: "Active"),
        ScannerStaff(id: "2", name: "Nuwan Silva", email: "nuwan@scope.lk", assignedCinema: "Scope Cinemas", status: "Active"),
        ScannerStaff(id: "3", name: "Dilani Fernando", email: "dilani@majestic.lk", assignedCinema: "Majestic City", status: "Inactive")
    ]

    public init() {}

    public var body: some View {
        NavigationStack {
            List {
                ForEach($scanners) { $staff in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(staff.name)
                                .font(.headline)
                            Spacer()
                            Text(staff.status)
                                .font(.caption2.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(staff.status == "Active" ? AppTheme.success.opacity(0.2) : AppTheme.danger.opacity(0.2))
                                .foregroundStyle(staff.status == "Active" ? AppTheme.success : AppTheme.danger)
                                .clipShape(Capsule())
                        }

                        Text(staff.email)
                            .font(.caption)
                            .foregroundStyle(AppTheme.muted)

                        HStack {
                            Image(systemName: "mappin.and.ellipse")
                                .font(.caption2)
                            Text("Assigned: \(staff.assignedCinema)")
                                .font(.caption.bold())
                        }
                        .foregroundStyle(AppTheme.ink)
                        .padding(.top, 2)
                    }
                    .padding(.vertical, 4)
                    .swipeActions(edge: .trailing) {
                        Button(staff.status == "Active" ? "Deactivate" : "Activate") {
                            staff.status = (staff.status == "Active" ? "Inactive" : "Active")
                        }
                        .tint(staff.status == "Active" ? .orange : .green)
                    }
                }
            }
            .navigationTitle("Scanner Staff")
        }
    }
}

public struct ScannerStaff: Identifiable {
    public let id: String
    public var name: String
    public var email: String
    public var assignedCinema: String
    public var status: String
}

public struct AdminRootView: View {
    public init() {}

    public var body: some View {
        TabView {
            AdminDashboardView()
                .tabItem { Label("Dashboard", systemImage: "chart.bar.fill") }

            AdminMovieListView()
                .tabItem { Label("Movies", systemImage: "film.stack.fill") }

            AdminShowManagerView()
                .tabItem { Label("Shows", systemImage: "calendar") }

            AdminCinemaManagerView()
                .tabItem { Label("Cinemas", systemImage: "building.2.fill") }

            AdminScannerManagerView()
                .tabItem { Label("Staff", systemImage: "person.badge.shield.checkmark.fill") }

            ProfileView()
                .tabItem { Label("Account", systemImage: "person.crop.circle") }
        }
        .tint(AppTheme.ink)
    }
}
