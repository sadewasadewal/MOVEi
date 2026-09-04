//
//  CustomerRootView.swift
//  MOVEI
//

import SwiftUI

public struct CustomerRootView: View {
    @State private var selectedTab = 0
    @State private var selectedMovie: Movie?
    @State private var showTicket: Ticket?
    @State private var showBookingMovie: Movie?

    public init() {}

    public var body: some View {
        TabView(selection: $selectedTab) {
            HomeView(
                onMovie: { selectedMovie = $0 },
                onTicket: { showTicket = $0 }
            )
            .tabItem { Label("Home", systemImage: "house.fill") }
            .tag(0)

            MoviesView(onMovie: { selectedMovie = $0 })
                .tabItem { Label("Movies", systemImage: "film.fill") }
                .tag(1)

            WalletView(onTicket: { showTicket = $0 })
                .tabItem { Label("Wallet", systemImage: "wallet.pass.fill") }
                .tag(2)

            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
                .tag(3)
        }
        .tint(AppTheme.ink)
        .sheet(item: $selectedMovie) { movie in
            MovieDetailView(movie: movie) {
                showBookingMovie = movie
            }
        }
        .sheet(item: $showBookingMovie) { movie in
            BookingView(movie: movie) { issuedTicket in
                selectedTab = 2 // Switch to Wallet
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    showTicket = issuedTicket
                }
            }
        }
        .fullScreenCover(item: $showTicket) { ticket in
            TicketDetailView(ticket: ticket) {
                showTicket = nil
            }
        }
    }
}
