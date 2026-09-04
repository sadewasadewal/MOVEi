//
//  HomeView.swift
//  MOVEI
//

import SwiftUI

public struct HomeView: View {
    @ObservedObject private var movieService = MovieService.shared
    public let onMovie: (Movie) -> Void
    public let onTicket: (Ticket) -> Void
    @State private var selectedMovieIndex = 0
    @GestureState private var dragOffset: CGFloat = 0

    public init(onMovie: @escaping (Movie) -> Void, onTicket: @escaping (Ticket) -> Void) {
        self.onMovie = onMovie
        self.onTicket = onTicket
    }

    public var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                Color.black.ignoresSafeArea()

                GeometryReader { proxy in
                    let width = proxy.size.width
                    let height = proxy.size.height
                    let movies = movieService.publishedMovies

                    HStack(spacing: 0) {
                        ForEach(movies) { movie in
                            HomeFeaturedPage(movie: movie, onBook: { onMovie(movie) })
                                .frame(width: width, height: height)
                        }
                    }
                    .frame(width: width * CGFloat(max(movies.count, 1)), alignment: .leading)
                    .offset(x: -CGFloat(selectedMovieIndex) * width + dragOffset)
                    .animation(.interactiveSpring(response: 0.42, dampingFraction: 0.86), value: selectedMovieIndex)
                    .gesture(
                        DragGesture(minimumDistance: 12)
                            .updating($dragOffset) { value, state, _ in
                                if abs(value.translation.width) > abs(value.translation.height) {
                                    state = value.translation.width
                                }
                            }
                            .onEnded { value in
                                let threshold = width * 0.18
                                withAnimation(.spring(response: 0.42, dampingFraction: 0.86)) {
                                    if value.translation.width < -threshold {
                                        selectedMovieIndex = min(selectedMovieIndex + 1, movies.count - 1)
                                    } else if value.translation.width > threshold {
                                        selectedMovieIndex = max(selectedMovieIndex - 1, 0)
                                    }
                                }
                            }
                    )
                }
                .ignoresSafeArea(edges: .top)
            }
            .navigationBarHidden(true)
        }
    }
}

public struct HomeFeaturedPage: View {
    public let movie: Movie
    public let onBook: () -> Void

    public init(movie: Movie, onBook: @escaping () -> Void) {
        self.movie = movie
        self.onBook = onBook
    }

    public var body: some View {
        GeometryReader { proxy in
            VStack(spacing: 0) {
                ZStack(alignment: .bottom) {
                    AsyncImage(url: URL(string: movie.backdropURL)) { phase in
                        switch phase {
                        case .success(let image):
                            image.resizable().scaledToFill()
                        default:
                            PosterFallback(movie: movie)
                        }
                    }
                    .frame(width: proxy.size.width, height: proxy.size.height * 0.58)
                    .clipped()

                    LinearGradient(colors: [.clear, .black.opacity(0.4), .black], startPoint: .center, endPoint: .bottom)
                }
                .frame(width: proxy.size.width, height: proxy.size.height * 0.58)
                .clipped()

                VStack(spacing: 12) {
                    Text(movie.title)
                        .font(.system(size: 38, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .padding(.top, 4)

                    HStack(spacing: 8) {
                        Image(systemName: "star.fill").foregroundStyle(.white)
                        Text(movie.rating)
                        Text("•")
                        Text(movie.genre.replacingOccurrences(of: " · ", with: "  •  "))
                        Text("•")
                        Text(movie.runtime)
                    }
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.white.opacity(0.78))

                    Text(movie.tagline)
                        .font(.callout)
                        .multilineTextAlignment(.center)
                        .foregroundStyle(.white.opacity(0.82))
                        .lineSpacing(3)
                        .lineLimit(1)
                        .padding(.horizontal, 24)

                    Spacer(minLength: 8)

                    VStack(spacing: 12) {
                        Button(action: onBook) {
                            Label("Book Show", systemImage: "ticket.fill")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 54)
                                .background(Color.blue, in: Capsule())
                        }

                        Button(action: onBook) {
                            Label("See Details", systemImage: "plus")
                                .font(.headline.weight(.medium))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 54)
                                .background(Color.white.opacity(0.12), in: Capsule())
                                .overlay(Capsule().stroke(Color.white.opacity(0.35), lineWidth: 1))
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 22)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .frame(width: proxy.size.width, height: proxy.size.height)
            .ignoresSafeArea(edges: .top)
        }
    }
}

public struct PosterFallback: View {
    public let movie: Movie

    public init(movie: Movie) {
        self.movie = movie
    }

    public var body: some View {
        ZStack {
            LinearGradient(colors: [movie.accent, .black], startPoint: .top, endPoint: .bottom)
            VStack(spacing: 12) {
                Image(systemName: "film.fill").font(.system(size: 42, weight: .light))
                Text(movie.title.uppercased()).font(.system(size: 26, weight: .black, design: .rounded)).multilineTextAlignment(.center)
            }
            .foregroundStyle(.white.opacity(0.88))
            .padding(28)
        }
    }
}
