//
//  UserRole.swift
//  MOVEI
//

import Foundation

public enum UserRole: String, Codable, CaseIterable, Identifiable {
    case customer
    case scanner
    case admin

    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .customer: return "Customer"
        case .scanner: return "Scanner Staff"
        case .admin: return "Administrator"
        }
    }

    public var badgeIcon: String {
        switch self {
        case .customer: return "person.fill"
        case .scanner: return "qrcode.viewfinder"
        case .admin: return "shield.lefthalf.filled"
        }
    }
}
