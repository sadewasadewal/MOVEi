//
//  MovieDetailView.swift
//  MOVEI
//

import SwiftUI

public struct MovieDetailView: View {
    @Environment(\.dismiss) private var dismiss
    public let movie: Movie
    public let onProceedToBooking: () -> Void

    public init(movie: Movie, onProceedToBooking: @escaping () -> Void) {
        self.movie = movie
        self.onProceedToBooking = onProceedToBooking
    }

    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                // Backdrop with navigation controls
                ZStack(alignment: .topTrailing) {
                    AsyncImage(url: URL(string: movie.backdropURL)) { image in
                        image.resizable().scaledToFill()
                    } placeholder: {
                        Rectangle().fill(movie.accent)
                    }
                    .frame(height: 380)
                    .clipped()

                    LinearGradient(colors: [.black.opacity(0.3), .clear, .black.opacity(0.9)], startPoint: .top, endPoint: .bottom)

                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.headline)
                            .foregroundStyle(.white)
                            .frame(width: 36, height: 36)
                            .background(.ultraThinMaterial, in: Circle())
                    }
                    .padding(20)
                }

                VStack(alignment: .leading, spacing: 18) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(movie.title)
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundStyle(AppTheme.ink)

                        Text(movie.tagline)
                            .font(.subheadline)
                            .foregroundStyle(AppTheme.muted)

                        HStack(spacing: 8) {
                            HStack(spacing: 4) {
                                Image(systemName: "star.fill").foregroundStyle(.orange)
                                Text(movie.rating).font(.subheadline.bold())
                            }
                            Text("•").foregroundStyle(AppTheme.muted)
                            Text(movie.genre).font(.subheadline).foregroundStyle(AppTheme.muted)
                            Text("•").foregroundStyle(AppTheme.muted)
                            Text(movie.runtime).font(.subheadline).foregroundStyle(AppTheme.muted)
                        }
                        .padding(.top, 4)
                    }

                    // Synopsis
                    VStack(alignment: .leading, spacing: 8) {
                        Text("SYNOPSIS")
                            .font(.caption.weight(.bold))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.muted)

                        Text(movie.description)
                            .font(.callout)
                            .lineSpacing(4)
                            .foregroundStyle(AppTheme.ink.opacity(0.85))
                    }

                    // Book CTA
                    Button {
                        dismiss()
                        onProceedToBooking()
                    } label: {
                        HStack(spacing: 8) {
                            Image(systemName: "ticket.fill")
                            Text("Book Tickets")
                        }
                        .font(.headline.weight(.bold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(AppTheme.ink, in: Capsule())
                    }
                    .padding(.top, 12)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 36)
            }
        }
        .background(AppTheme.canvas.ignoresSafeArea())
    }
}
