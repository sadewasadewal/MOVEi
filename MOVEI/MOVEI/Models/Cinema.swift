//
//  Cinema.swift
//  MOVEI
//

import Foundation

public struct Cinema: Identifiable, Codable, Hashable {
    public let id: String
    public var name: String
    public var address: String
    public var city: String
    public var phone: String?
    public var logoURL: String?
    public var status: String

    public init(id: String = UUID().uuidString, name: String, address: String, city: String = "Colombo", phone: String? = nil, logoURL: String? = nil, status: String = "active") {
        self.id = id
        self.name = name
        self.address = address
        self.city = city
        self.phone = phone
        self.logoURL = logoURL
        self.status = status
    }
}

public struct Screen: Identifiable, Codable, Hashable {
    public let id: String
    public var cinemaID: String
    public var name: String
    public var screenNumber: Int
    public var capacity: Int
    public var screenType: String

    public init(id: String = UUID().uuidString, cinemaID: String, name: String, screenNumber: Int, capacity: Int = 30, screenType: String = "standard") {
        self.id = id
        self.cinemaID = cinemaID
        self.name = name
        self.screenNumber = screenNumber
        self.capacity = capacity
        self.screenType = screenType
    }
}

public enum SeatType: String, Codable, CaseIterable, Identifiable {
    case standard
    case premium
    case vip
    case disabled

    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .standard: return "Standard"
        case .premium: return "Premium"
        case .vip: return "VIP"
        case .disabled: return "Accessible"
        }
    }
}

public struct Seat: Identifiable, Codable, Hashable {
    public let id: String
    public var screenID: String
    public var rowLabel: String
    public var seatNumber: Int
    public var seatType: SeatType
    public var xPosition: Int
    public var yPosition: Int
    public var isActive: Bool

    public var label: String {
        "\(rowLabel)\(seatNumber)"
    }

    public init(id: String = UUID().uuidString, screenID: String, rowLabel: String, seatNumber: Int, seatType: SeatType = .standard, xPosition: Int = 0, yPosition: Int = 0, isActive: Bool = true) {
        self.id = id
        self.screenID = screenID
        self.rowLabel = rowLabel
        self.seatNumber = seatNumber
        self.seatType = seatType
        self.xPosition = xPosition
        self.yPosition = yPosition
        self.isActive = isActive
    }
}
