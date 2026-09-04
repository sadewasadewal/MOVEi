//
//  BookingView.swift
//  MOVEI
//

import SwiftUI
import SwiftData

public struct BookingView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @ObservedObject private var cinemaService = CinemaService.shared
    @ObservedObject private var showService = ShowService.shared
    @ObservedObject private var bookingService = BookingService.shared
    @ObservedObject private var ticketService = TicketService.shared

    public let movie: Movie
    public let onCompleted: (Ticket) -> Void

    @State private var selectedCinemaIndex = 0
    @State private var selectedShowIndex = 0
    @State private var selectedSeats: Set<Seat> = []
    @State private var isCheckingOut = false
    @State private var errorMessage: String?

    public init(movie: Movie, onCompleted: @escaping (Ticket) -> Void) {
        self.movie = movie
        self.onCompleted = onCompleted
    }

    private var currentCinema: Cinema? {
        guard !cinemaService.cinemas.isEmpty else { return nil }
        return cinemaService.cinemas[selectedCinemaIndex % cinemaService.cinemas.count]
    }

    private var availableShows: [Show] {
        showService.shows(for: movie.id)
    }

    private var currentShow: Show? {
        guard !availableShows.isEmpty else { return nil }
        return availableShows[selectedShowIndex % availableShows.count]
    }

    private var currentSeats: [Seat] {
        guard let cinema = currentCinema,
              let screen = cinemaService.screens(for: cinema.id).first else { return [] }
        return cinemaService.seats(for: screen.id)
    }

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    // Movie info header
                    HStack(spacing: 14) {
                        AsyncImage(url: URL(string: movie.posterURL)) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Rectangle().fill(movie.accent)
                        }
                        .frame(width: 60, height: 86)
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                        VStack(alignment: .leading, spacing: 4) {
                            Text("BOOKING PASS")
                                .font(.caption2.weight(.bold))
                                .tracking(1.4)
                                .foregroundStyle(AppTheme.muted)
                            Text(movie.title)
                                .font(.title3.weight(.bold))
                                .lineLimit(1)
                            Text(movie.genre)
                                .font(.caption)
                                .foregroundStyle(AppTheme.muted)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)

                    // 10-Minute Reservation Hold Timer
                    if bookingService.activeHoldTimerSeconds > 0 {
                        HStack(spacing: 8) {
                            Image(systemName: "timer")
                                .foregroundStyle(AppTheme.warning)
                            Text("Seats held for: ")
                                .font(.caption.weight(.bold))
                            let mins = bookingService.activeHoldTimerSeconds / 60
                            let secs = bookingService.activeHoldTimerSeconds % 60
                            Text(String(format: "%02d:%02d", mins, secs))
                                .font(.caption.monospaced().weight(.black))
                                .foregroundStyle(AppTheme.ink)
                            Spacer()
                        }
                        .padding(12)
                        .background(AppTheme.warning.opacity(0.18))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .padding(.horizontal, 20)
                    }

                    // Cinema selection
                    VStack(alignment: .leading, spacing: 10) {
                        Text("SELECT CINEMA")
                            .font(.caption.weight(.bold))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.muted)

                        ForEach(Array(cinemaService.cinemas.enumerated()), id: \.element.id) { index, cinema in
                            Button {
                                selectedCinemaIndex = index
                                selectedSeats.removeAll()
                            } label: {
                                HStack {
                                    Image(systemName: selectedCinemaIndex == index ? "checkmark.circle.fill" : "circle")
                                        .foregroundStyle(selectedCinemaIndex == index ? AppTheme.lime : AppTheme.muted)
                                    Text(cinema.name)
                                        .font(.subheadline.weight(.semibold))
                                    Spacer()
                                    Text(cinema.city)
                                        .font(.caption)
                                        .foregroundStyle(AppTheme.muted)
                                }
                                .padding(14)
                                .background(selectedCinemaIndex == index ? AppTheme.ink : Color.white)
                                .foregroundStyle(selectedCinemaIndex == index ? Color.white : AppTheme.ink)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                    }
                    .padding(.horizontal, 20)

                    // Showtime selection
                    if !availableShows.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("SELECT SHOWTIME")
                                .font(.caption.weight(.bold))
                                .tracking(1.4)
                                .foregroundStyle(AppTheme.muted)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(Array(availableShows.enumerated()), id: \.element.id) { index, show in
                                        Button {
                                            selectedShowIndex = index
                                            selectedSeats.removeAll()
                                        } label: {
                                            VStack(spacing: 3) {
                                                Text(show.startTime.formatted(date: .omitted, time: .shortened))
                                                    .font(.subheadline.weight(.bold))
                                                Text("From Rs. \(Int(show.priceStandard))")
                                                    .font(.caption2)
                                                    .opacity(0.8)
                                            }
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 12)
                                            .background(selectedShowIndex == index ? AppTheme.ink : Color.white)
                                            .foregroundStyle(selectedShowIndex == index ? Color.white : AppTheme.ink)
                                            .clipShape(RoundedRectangle(cornerRadius: 14))
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }

                    // Interactive Seat Map
                    VStack(alignment: .leading, spacing: 10) {
                        Text("CHOOSE SEATS")
                            .font(.caption.weight(.bold))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.muted)

                        SeatMapView(
                            seats: currentSeats,
                            selectedSeats: $selectedSeats,
                            bookedSeatIDs: bookingService.bookedSeatIDs,
                            heldSeatIDs: Set(bookingService.heldSeats.keys)
                        ) { seat in
                            if let show = currentShow {
                                _ = bookingService.holdSeats(seats: Array(selectedSeats), for: show)
                            }
                        }
                    }
                    .padding(.horizontal, 20)

                    // Price & Checkout
                    if let show = currentShow {
                        let total = bookingService.calculateTotal(for: Array(selectedSeats), in: show)
                        VStack(spacing: 12) {
                            Button {
                                Task {
                                    guard let cinema = currentCinema,
                                          let screen = cinemaService.screens(for: cinema.id).first else { return }
                                    isCheckingOut = true
                                    let result = await bookingService.checkoutAndIssueTickets(
                                        seats: Array(selectedSeats),
                                        for: show,
                                        movie: movie,
                                        cinema: cinema,
                                        screen: screen,
                                        userID: AuthService.shared.currentUser?.id.uuidString ?? "guest"
                                    )
                                    isCheckingOut = false
                                    if result.success, let first = result.tickets.first {
                                        for t in result.tickets {
                                            ticketService.addTicket(t)
                                            // SwiftData offline caching
                                            let rec = TicketRecord(from: t)
                                            modelContext.insert(rec)
                                        }
                                        try? modelContext.save()
                                        dismiss()
                                        onCompleted(first)
                                    } else {
                                        errorMessage = result.message
                                    }
                                }
                            } label: {
                                if isCheckingOut {
                                    ProgressView().tint(.white)
                                } else {
                                    Text(selectedSeats.isEmpty ? "Select Seats to Continue" : "Confirm & Pay · Rs. \(Int(total))")
                                        .font(.headline.weight(.bold))
                                        .foregroundStyle(.white)
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 54)
                                        .background(selectedSeats.isEmpty ? AppTheme.muted : AppTheme.ink, in: Capsule())
                                }
                            }
                            .disabled(selectedSeats.isEmpty || isCheckingOut)
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 24)
                    }
                }
            }
            .background(AppTheme.canvas.ignoresSafeArea())
            .navigationTitle("Book Tickets")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") {
                        bookingService.releaseHolds(seats: Array(selectedSeats))
                        dismiss()
                    }
                }
            }
        }
    }
}
