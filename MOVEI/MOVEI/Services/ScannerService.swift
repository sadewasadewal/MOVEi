//
//  ScannerService.swift
//  MOVEI
//

import SwiftUI
import Combine

public struct AdmissionResult {
    public let isValid: Bool
    public let statusType: StatusType
    public let title: String
    public let message: String
    public let ticketCode: String
    public let movieTitle: String?
    public let customerName: String?
    public let cinemaName: String?
    public let screenName: String?
    public let seat: String?
    public let showtime: Date?
    public let scannedAt: Date?

    public enum StatusType {
        case valid
        case alreadyUsed
        case wrongCinema
        case cancelled
        case expired
        case invalid
    }
}

@MainActor
public final class ScannerService: ObservableObject {
    public static let shared = ScannerService()

    @Published public var assignedCinema: Cinema = Cinema(
        id: "cinemax-colombo",
        name: "Cinemax Colombo",
        address: "125 Galle Road, Colombo 03"
    )
    @Published public var recentScans: [TicketScan] = []
    @Published public var totalAdmissionsToday: Int = 24

    private init() {
        // Preload recent scan logs for scanner dashboard
        self.recentScans = [
            TicketScan(ticketCode: "MOV-82K9A-01", scannerID: "scanner-1", cinemaID: "cinemax-colombo", scannedAt: Date().addingTimeInterval(-1800), result: "valid", movieTitle: "Wicked", customerName: "Sadew", seat: "B4"),
            TicketScan(ticketCode: "MOV-82K9A-02", scannerID: "scanner-1", cinemaID: "cinemax-colombo", scannedAt: Date().addingTimeInterval(-1780), result: "valid", movieTitle: "Wicked", customerName: "Sadew", seat: "B5"),
            TicketScan(ticketCode: "MOV-19FB02-01", scannerID: "scanner-1", cinemaID: "cinemax-colombo", scannedAt: Date().addingTimeInterval(-720), result: "already_used", movieTitle: "Oppenheimer", customerName: "Michael", seat: "D3")
        ]
    }

    public func validateTicket(barcode: String) -> AdmissionResult {
        let cleanCode = barcode.trimmingCharacters(in: .whitespacesAndNewlines)
        let ticketService = TicketService.shared

        guard let ticket = ticketService.tickets.first(where: { $0.ticketCode == cleanCode || $0.barcodeValue == cleanCode }) else {
            let scan = TicketScan(ticketCode: cleanCode, scannerID: "scanner-04", cinemaID: assignedCinema.id, result: "invalid")
            recentScans.insert(scan, at: 0)
            return AdmissionResult(
                isValid: false,
                statusType: .invalid,
                title: "INVALID TICKET",
                message: "No ticket record found matching code: \(cleanCode)",
                ticketCode: cleanCode,
                movieTitle: nil,
                customerName: nil,
                cinemaName: nil,
                screenName: nil,
                seat: nil,
                showtime: nil,
                scannedAt: nil
            )
        }

        // Venue check
        if !ticket.cinemaName.localizedCaseInsensitiveContains(assignedCinema.name) &&
           !assignedCinema.name.localizedCaseInsensitiveContains(ticket.cinemaName) {
            let scan = TicketScan(ticketID: ticket.id, ticketCode: cleanCode, scannerID: "scanner-04", cinemaID: assignedCinema.id, result: "wrong_cinema", movieTitle: ticket.movieTitle, customerName: "Customer", seat: ticket.seatLabel)
            recentScans.insert(scan, at: 0)
            return AdmissionResult(
                isValid: false,
                statusType: .wrongCinema,
                title: "WRONG VENUE",
                message: "Ticket is valid only at: \(ticket.cinemaName)",
                ticketCode: cleanCode,
                movieTitle: ticket.movieTitle,
                customerName: nil,
                cinemaName: ticket.cinemaName,
                screenName: ticket.screenName,
                seat: ticket.seatLabel,
                showtime: ticket.showtime,
                scannedAt: nil
            )
        }

        // Duplicate entry check
        if ticket.status == "used" {
            let scan = TicketScan(ticketID: ticket.id, ticketCode: cleanCode, scannerID: "scanner-04", cinemaID: assignedCinema.id, result: "already_used", movieTitle: ticket.movieTitle, customerName: "Customer", seat: ticket.seatLabel)
            recentScans.insert(scan, at: 0)
            return AdmissionResult(
                isValid: false,
                statusType: .alreadyUsed,
                title: "ALREADY USED",
                message: "Ticket was already admitted at \(ticket.scannedAt?.formatted(date: .omitted, time: .shortened) ?? "earlier").",
                ticketCode: cleanCode,
                movieTitle: ticket.movieTitle,
                customerName: nil,
                cinemaName: ticket.cinemaName,
                screenName: ticket.screenName,
                seat: ticket.seatLabel,
                showtime: ticket.showtime,
                scannedAt: ticket.scannedAt
            )
        }

        // Valid admission
        ticketService.markTicketUsed(ticketCode: cleanCode)
        totalAdmissionsToday += 1
        let scan = TicketScan(ticketID: ticket.id, ticketCode: cleanCode, scannerID: "scanner-04", cinemaID: assignedCinema.id, result: "valid", movieTitle: ticket.movieTitle, customerName: "Sadew", seat: ticket.seatLabel)
        recentScans.insert(scan, at: 0)
        UINotificationFeedbackGenerator().notificationOccurred(.success)

        return AdmissionResult(
            isValid: true,
            statusType: .valid,
            title: "VALID TICKET",
            message: "Admission authorized. Enjoy the movie!",
            ticketCode: cleanCode,
            movieTitle: ticket.movieTitle,
            customerName: "Sadew",
            cinemaName: ticket.cinemaName,
            screenName: ticket.screenName,
            seat: ticket.seatLabel,
            showtime: ticket.showtime,
            scannedAt: Date()
        )
    }
}
