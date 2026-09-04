//
//  MovieService.swift
//  MOVEI
//

import SwiftUI
import Combine

@MainActor
public final class MovieService: ObservableObject {
    public static let shared = MovieService()

    @Published public var movies: [Movie] = []
    @Published public var isLoading: Bool = false

    public var publishedMovies: [Movie] {
        movies.filter { $0.status == .published }
    }

    private init() {
        loadDefaultMovies()
    }

    public func loadDefaultMovies() {
        self.movies = [
            Movie(
                id: "wicked",
                title: "Wicked",
                slug: "wicked",
                tagline: "Everyone deserves the chance to fly.",
                description: "Elphaba, an ostracized but gifted young woman, forms an unlikely bond with Glinda, an ambitious, popular young woman.",
                genres: ["Fantasy", "Musical"],
                runtimeMinutes: 160,
                rating: "8.1",
                posterURL: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
                backdropURL: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
                status: .published
            ),
            Movie(
                id: "brand-new-day",
                title: "Brand New Day",
                slug: "brand-new-day",
                tagline: "A rising hero must confront a forgotten menace that threatens to plunge the city into darkness.",
                description: "Peter Parker embarks on a completely new path with fresh challenges facing him across Manhattan.",
                genres: ["Action", "Adventure", "Superhero"],
                runtimeMinutes: 138,
                rating: "8.7",
                posterURL: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1200&q=90",
                backdropURL: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1800&q=90",
                status: .published
            ),
            Movie(
                id: "oppenheimer",
                title: "Oppenheimer",
                slug: "oppenheimer",
                tagline: "The world forever changes.",
                description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                genres: ["Biography", "Drama", "History"],
                runtimeMinutes: 180,
                rating: "8.6",
                posterURL: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                backdropURL: "https://image.tmdb.org/t/p/w1280/4TfLwWlQhY9G7XKp7e9R5K3b1Qj.jpg",
                status: .published
            ),
            Movie(
                id: "interstellar",
                title: "Interstellar",
                slug: "interstellar",
                tagline: "Mankind was born on Earth. It was never meant to die here.",
                description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft.",
                genres: ["Adventure", "Drama", "Sci-Fi"],
                runtimeMinutes: 169,
                rating: "8.7",
                posterURL: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                backdropURL: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
                status: .published
            ),
            Movie(
                id: "barbie",
                title: "Barbie",
                slug: "barbie",
                tagline: "She's everything. He's just Ken.",
                description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
                genres: ["Comedy", "Adventure", "Fantasy"],
                runtimeMinutes: 114,
                rating: "7.8",
                posterURL: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
                backdropURL: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
                status: .published
            ),
            Movie(
                id: "top-gun",
                title: "Top Gun: Maverick",
                slug: "top-gun",
                tagline: "Feel the need. The need for speed.",
                description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
                genres: ["Action", "Drama"],
                runtimeMinutes: 131,
                rating: "8.3",
                posterURL: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                backdropURL: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                status: .published
            )
        ]
    }

    public func addOrUpdate(movie: Movie) {
        if let idx = movies.firstIndex(where: { $0.id == movie.id }) {
            movies[idx] = movie
        } else {
            movies.append(movie)
        }
    }

    public func canPublish(movie: Movie) -> (canPublish: Bool, reasons: [String]) {
        var reasons: [String] = []
        if movie.title.trimmingCharacters(in: .whitespaces).isEmpty {
            reasons.append("Title is required")
        }
        if movie.description.trimmingCharacters(in: .whitespaces).isEmpty {
            reasons.append("Description is required")
        }
        if movie.posterURL.trimmingCharacters(in: .whitespaces).isEmpty {
            reasons.append("Poster artwork is required")
        }
        if movie.backdropURL.trimmingCharacters(in: .whitespaces).isEmpty {
            reasons.append("Backdrop artwork is required")
        }
        if movie.runtimeMinutes <= 0 {
            reasons.append("Valid runtime is required")
        }
        if movie.genres.isEmpty {
            reasons.append("At least one genre is required")
        }
        return (reasons.isEmpty, reasons)
    }

    public func publish(movieID: String) -> Bool {
        guard let idx = movies.firstIndex(where: { $0.id == movieID }) else { return false }
        let (valid, _) = canPublish(movie: movies[idx])
        if valid {
            movies[idx].status = .published
            return true
        }
        return false
    }

    public func archive(movieID: String) {
        if let idx = movies.firstIndex(where: { $0.id == movieID }) {
            movies[idx].status = .archived
        }
    }
}
