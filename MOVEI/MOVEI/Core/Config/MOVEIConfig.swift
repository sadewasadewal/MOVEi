//
//  MOVEIConfig.swift
//  MOVEI
//

import Foundation

public enum MOVEIConfig {
    // Supabase project connection settings (Only anonymous/public client key!)
    public static var supabaseURL: URL {
        URL(string: ProcessInfo.processInfo.environment["SUPABASE_URL"] ?? "https://example-project.supabase.co")!
    }

    public static var supabaseAnonKey: String {
        ProcessInfo.processInfo.environment["SUPABASE_ANON_KEY"] ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock-key"
    }

    // Storage Buckets
    public enum Buckets {
        public static let moviePosters = "movie-posters"
        public static let movieBackdrops = "movie-backdrops"
        public static let movieLogos = "movie-logos"
        public static let cinemaLogos = "cinema-logos"
        public static let userAvatars = "user-avatars"
    }

    // Image Requirements Specification
    public enum ImageSpecs {
        public static let poster = ImageRequirement(
            name: "Movie Poster",
            width: 2000,
            height: 3000,
            aspectRatio: 2.0 / 3.0,
            minWidth: 1000,
            minHeight: 1500,
            maximumFileSizeMB: 10.0,
            ratioLabel: "2 : 3",
            recommendedLabel: "2000 × 3000 px",
            isTransparentPngRequired: false
        )

        public static let backdrop = ImageRequirement(
            name: "Movie Backdrop",
            width: 3840,
            height: 2160,
            aspectRatio: 16.0 / 9.0,
            minWidth: 1920,
            minHeight: 1080,
            maximumFileSizeMB: 10.0,
            ratioLabel: "16 : 9",
            recommendedLabel: "3840 × 2160 px",
            isTransparentPngRequired: false
        )

        public static let logo = ImageRequirement(
            name: "Movie Title Logo",
            width: 2000,
            height: 1000,
            aspectRatio: 2.0 / 1.0,
            minWidth: 800,
            minHeight: 400,
            maximumFileSizeMB: 5.0,
            ratioLabel: "Transparent PNG (2:1)",
            recommendedLabel: "2000 × 1000 px",
            isTransparentPngRequired: true
        )
    }
}
