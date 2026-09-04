//
//  TicketService.swift
//  MOVEI
//

import SwiftUI
import Combine
import SwiftData

@MainActor
public final class TicketService: ObservableObject {
    public static let shared = TicketService()

    @Published public var tickets: [Ticket] = []

    private init() {
        loadDefaultTickets()
    }

    private func loadDefaultTickets() {
        let calendar = Calendar.current
        let now = Date()
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: now) ?? now
        let inThreeDays = calendar.date(byAdding: .day, value: 3, to: now) ?? now

        let t1 = Ticket(
            bookingID: "MOV-75EB31",
            showID: "show-wicked-01",
            userID: "11111111-2222-3333-4444-555555555555",
            seatID: "cinemax-s04-B4",
            seatLabel: "B4 · B5",
            ticketCode: "MOV-75EB31-01",
            barcodeValue: "MOV-75EB31-01",
            status: "confirmed",
            movieTitle: "Wicked",
            posterURL: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
            backdropURL: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
            cinemaName: "Cinemax Colombo",
            screenName: "Screen 04",
            showtime: tomorrow
        )

        let t2 = Ticket(
            bookingID: "MOV-92FA44",
            showID: "show-spiderman-01",
            userID: "11111111-2222-3333-4444-555555555555",
            seatID: "scope-s02-C2",
            seatLabel: "C2 · C3",
            ticketCode: "MOV-92FA44-01",
            barcodeValue: "MOV-92FA44-01",
            status: "confirmed",
            movieTitle: "Brand New Day",
            posterURL: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1200&q=90",
            backdropURL: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1800&q=90",
            cinemaName: "Scope Cinemas",
            screenName: "Screen 02",
            showtime: inThreeDays
        )

        self.tickets = [t1, t2]
    }

    public func addTicket(_ ticket: Ticket) {
        tickets.insert(ticket, at: 0)
    }

    public func deleteTicket(_ ticket: Ticket) {
        tickets.removeAll { $0.id == ticket.id }
    }

    public func clearAllTickets() {
        tickets.removeAll()
    }

    public func markTicketUsed(ticketCode: String) {
        if let idx = tickets.firstIndex(where: { $0.ticketCode == ticketCode || $0.barcodeValue == ticketCode }) {
            tickets[idx].status = "used"
            tickets[idx].scannedAt = Date()
        }
    }

    public var upcomingTickets: [Ticket] {
        tickets.filter { $0.status == "confirmed" || $0.status == "reserved" }
    }

    public var watchedTickets: [Ticket] {
        tickets.filter { $0.status == "used" || $0.showtime < Date() }
    }
}
