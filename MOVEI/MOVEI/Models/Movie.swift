//
//  Movie.swift
//  MOVEI
//

import SwiftUI

public enum MovieStatus: String, Codable, CaseIterable, Identifiable {
    case draft
    case published
    case archived

    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .draft: return "Draft"
        case .published: return "Published"
        case .archived: return "Archived"
        }
    }
}

public struct Movie: Identifiable, Codable, Hashable {
    public let id: String
    public var title: String
    public var slug: String
    public var tagline: String
    public var description: String
    public var genre: String
    public var genres: [String]
    public var runtime: String
    public var runtimeMinutes: Int
    public var rating: String
    public var posterURL: String
    public var backdropURL: String
    public var logoURL: String?
    public var trailerURL: String?
    public var status: MovieStatus
    public var releaseDate: Date

    // Computed accent color based on slug/genres for backwards compatibility with UI
    public var accent: Color {
        switch slug {
        case "wicked": return .green
        case "brand-new-day": return .red
        case "oppenheimer": return .orange
        case "interstellar": return .cyan
        case "barbie": return .pink
        case "the-batman": return .yellow
        default: return AppTheme.lime
        }
    }

    public init(
        id: String = UUID().uuidString,
        title: String,
        slug: String,
        tagline: String,
        description: String = "",
        genres: [String],
        runtimeMinutes: Int,
        rating: String = "8.0",
        posterURL: String,
        backdropURL: String,
        logoURL: String? = nil,
        trailerURL: String? = nil,
        status: MovieStatus = .published,
        releaseDate: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.slug = slug
        self.tagline = tagline
        self.description = description
        self.genres = genres
        self.genre = genres.joined(separator: " · ")
        self.runtimeMinutes = runtimeMinutes
        let hours = runtimeMinutes / 60
        let mins = runtimeMinutes % 60
        self.runtime = "\(hours)h \(mins)m"
        self.rating = rating
        self.posterURL = posterURL
        self.backdropURL = backdropURL
        self.logoURL = logoURL
        self.trailerURL = trailerURL
        self.status = status
        self.releaseDate = releaseDate
    }
}
