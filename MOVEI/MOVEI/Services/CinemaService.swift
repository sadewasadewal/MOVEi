//
//  CinemaService.swift
//  MOVEI
//

import SwiftUI
import Combine

@MainActor
public final class CinemaService: ObservableObject {
    public static let shared = CinemaService()

    @Published public var cinemas: [Cinema] = []
    @Published public var screens: [Screen] = []
    @Published public var seats: [Seat] = []

    private init() {
        loadDefaultCinemaData()
    }

    private func loadDefaultCinemaData() {
        let c1 = Cinema(id: "cinemax-colombo", name: "Cinemax Colombo", address: "125 Galle Road, Colombo 03", city: "Colombo", phone: "+94 11 234 5678", logoURL: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400")
        let c2 = Cinema(id: "scope-cinemas", name: "Scope Cinemas", address: "Colombo City Centre", city: "Colombo", phone: "+94 11 765 4321", logoURL: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400")
        let c3 = Cinema(id: "majestic-city", name: "Majestic City", address: "10 Station Road, Bambalapitiya", city: "Colombo", phone: "+94 11 258 9632", logoURL: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400")

        self.cinemas = [c1, c2, c3]

        let s1 = Screen(id: "cinemax-s04", cinemaID: c1.id, name: "Screen 04", screenNumber: 4, capacity: 30, screenType: "imax")
        let s2 = Screen(id: "scope-s02", cinemaID: c2.id, name: "Screen 02", screenNumber: 2, capacity: 30, screenType: "standard")
        let s3 = Screen(id: "majestic-s01", cinemaID: c3.id, name: "Screen 01", screenNumber: 1, capacity: 30, screenType: "standard")
        self.screens = [s1, s2, s3]

        var defaultSeats: [Seat] = []
        for screen in [s1, s2, s3] {
            for row in ["A", "B", "C", "D", "E"] {
                for num in 1...6 {
                    let type: SeatType = (row == "D" || row == "E") ? .vip : (row == "C" ? .premium : .standard)
                    let seat = Seat(
                        id: "\(screen.id)-\(row)\(num)",
                        screenID: screen.id,
                        rowLabel: row,
                        seatNumber: num,
                        seatType: type,
                        xPosition: num,
                        yPosition: Int(row.first!.asciiValue! - 64)
                    )
                    defaultSeats.append(seat)
                }
            }
        }
        self.seats = defaultSeats
    }

    public func addCinema(_ cinema: Cinema) {
        cinemas.append(cinema)
    }

    public func updateCinema(_ cinema: Cinema) {
        if let idx = cinemas.firstIndex(where: { $0.id == cinema.id }) {
            cinemas[idx] = cinema
        }
    }

    public func screens(for cinemaID: String) -> [Screen] {
        screens.filter { $0.cinemaID == cinemaID }
    }

    public func seats(for screenID: String) -> [Seat] {
        seats.filter { $0.screenID == screenID }
    }
}
