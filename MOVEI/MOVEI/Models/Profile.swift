//
//  Profile.swift
//  MOVEI
//

import Foundation

public struct Profile: Identifiable, Codable, Hashable {
    public let id: UUID
    public var fullName: String
    public var avatarURL: String?
    public var phone: String?
    public var role: UserRole
    public let createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case fullName = "full_name"
        case avatarURL = "avatar_url"
        case phone
        case role
        case createdAt = "created_at"
    }

    public init(id: UUID, fullName: String, avatarURL: String? = nil, phone: String? = nil, role: UserRole = .customer, createdAt: Date? = Date()) {
        self.id = id
        self.fullName = fullName
        self.avatarURL = avatarURL
        self.phone = phone
        self.role = role
        self.createdAt = createdAt
    }
}
