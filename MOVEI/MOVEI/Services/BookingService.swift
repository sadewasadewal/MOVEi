//
//  BookingService.swift
//  MOVEI
//

import SwiftUI
import Combine

@MainActor
public final class BookingService: ObservableObject {
    public static let shared = BookingService()

    @Published public var heldSeats: [String: Date] = [:] // seatID: expiryDate
    @Published public var bookedSeatIDs: Set<String> = []
    @Published public var activeHoldTimerSeconds: Int = 0

    private var timerCancellable: AnyCancellable?
    private let paymentService: PaymentService = MockPaymentService.shared

    private init() {
        // Pre-populate some booked seats for realism
        bookedSeatIDs = ["cinemax-s04-A1", "cinemax-s04-A2", "cinemax-s04-C3"]
    }

    public func holdSeats(seats: [Seat], for show: Show) -> (success: Bool, message: String, expiry: Date) {
        let now = Date()
        let expiry = now.addingTimeInterval(10 * 60) // 10 minutes

        for seat in seats {
            if bookedSeatIDs.contains(seat.id) {
                return (false, "Seat \(seat.label) is already booked.", now)
            }
            if let existingHold = heldSeats[seat.id], existingHold > now {
                return (false, "Seat \(seat.label) is currently held by another guest.", now)
            }
        }

        for seat in seats {
            heldSeats[seat.id] = expiry
        }

        startCountdown(seconds: 10 * 60)
        return (true, "Seats held for 10 minutes.", expiry)
    }

    public func releaseHolds(seats: [Seat]) {
        for seat in seats {
            heldSeats.removeValue(forKey: seat.id)
        }
        stopCountdown()
    }

    public func calculateTotal(for seats: [Seat], in show: Show) -> Double {
        var total = 0.0
        for seat in seats {
            switch seat.seatType {
            case .vip: total += show.priceVIP
            case .premium: total += show.pricePremium
            case .standard, .disabled: total += show.priceStandard
            }
        }
        return total
    }

    public func checkoutAndIssueTickets(
        seats: [Seat],
        for show: Show,
        movie: Movie,
        cinema: Cinema,
        screen: Screen,
        userID: String
    ) async -> (success: Bool, tickets: [Ticket], message: String) {
        let total = calculateTotal(for: seats, in: show)
        let bookingRef = "MOV-" + UUID().uuidString.prefix(6).uppercased()

        let payment = await paymentService.processPayment(amount: total, currency: "LKR", bookingRef: bookingRef)
        guard payment.isSuccess else {
            return (false, [], payment.errorMessage ?? "Payment failed.")
        }

        var createdTickets: [Ticket] = []
        for (index, seat) in seats.enumerated() {
            let code = "\(bookingRef)-\(String(format: "%02d", index + 1))"
            let ticket = Ticket(
                bookingID: bookingRef,
                showID: show.id,
                userID: userID,
                seatID: seat.id,
                seatLabel: seat.label,
                ticketCode: code,
                barcodeValue: code,
                status: "confirmed",
                movieTitle: movie.title,
                posterURL: movie.posterURL,
                backdropURL: movie.backdropURL,
                cinemaName: cinema.name,
                screenName: screen.name,
                showtime: show.startTime
            )
            createdTickets.append(ticket)
            bookedSeatIDs.insert(seat.id)
            heldSeats.removeValue(forKey: seat.id)
        }

        stopCountdown()
        return (true, createdTickets, "Booking confirmed!")
    }

    private func startCountdown(seconds: Int) {
        activeHoldTimerSeconds = seconds
        timerCancellable?.cancel()
        timerCancellable = Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                if self.activeHoldTimerSeconds > 0 {
                    self.activeHoldTimerSeconds -= 1
                } else {
                    self.stopCountdown()
                }
            }
    }

    private func stopCountdown() {
        activeHoldTimerSeconds = 0
        timerCancellable?.cancel()
        timerCancellable = nil
    }
}
