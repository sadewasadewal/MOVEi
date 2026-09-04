//
//  AdminShowManagerView.swift
//  MOVEI
//

import SwiftUI

public struct AdminShowManagerView: View {
    @ObservedObject private var showService = ShowService.shared
    @ObservedObject private var movieService = MovieService.shared
    @ObservedObject private var cinemaService = CinemaService.shared
    @State private var isCreating = false
    @State private var alertMessage: String?

    public init() {}

    public var body: some View {
        NavigationStack {
            List {
                ForEach(showService.shows) { show in
                    let movie = movieService.movies.first(where: { $0.id == show.movieID })
                    let cinema = cinemaService.cinemas.first(where: { $0.id == show.cinemaID })

                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(movie?.title ?? "Unknown Movie")
                                .font(.headline)
                            Spacer()
                            Text("Rs. \(Int(show.priceStandard))")
                                .font(.caption.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(AppTheme.lime.opacity(0.3))
                                .clipShape(Capsule())
                        }

                        Text("\(cinema?.name ?? "Cinema") · \(show.startTime.formatted(date: .abbreviated, time: .shortened))")
                            .font(.caption)
                            .foregroundStyle(AppTheme.muted)
                    }
                    .swipeActions(edge: .leading) {
                        Button("Duplicate +1 Day") {
                            let ok = showService.duplicateShow(showID: show.id)
                            if !ok {
                                alertMessage = "Could not duplicate show: overlaps with existing screening."
                            }
                        }
                        .tint(.blue)
                    }
                    .swipeActions(edge: .trailing) {
                        Button("Cancel Show", role: .destructive) {
                            showService.cancelShow(showID: show.id)
                        }
                    }
                }
            }
            .navigationTitle("Show Scheduling")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        isCreating = true
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                            .foregroundStyle(AppTheme.ink)
                    }
                }
            }
            .sheet(isPresented: $isCreating) {
                CreateShowModalView()
            }
            .alert("Notice", isPresented: Binding(get: { alertMessage != nil }, set: { if !$0 { alertMessage = nil } })) {
                Button("OK") {}
            } message: {
                Text(alertMessage ?? "")
            }
        }
    }
}

public struct CreateShowModalView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var showService = ShowService.shared
    @ObservedObject private var movieService = MovieService.shared
    @ObservedObject private var cinemaService = CinemaService.shared

    @State private var selectedMovieID: String = ""
    @State private var selectedCinemaID: String = ""
    @State private var selectedScreenID: String = ""
    @State private var startTime = Date().addingTimeInterval(3600 * 2)
    @State private var standardPrice = "1000"
    @State private var errorMessage: String?

    public var body: some View {
        NavigationStack {
            Form {
                Section("Movie & Venue") {
                    Picker("Movie", selection: $selectedMovieID) {
                        ForEach(movieService.publishedMovies) { m in
                            Text(m.title).tag(m.id)
                        }
                    }

                    Picker("Cinema", selection: $selectedCinemaID) {
                        ForEach(cinemaService.cinemas) { c in
                            Text(c.name).tag(c.id)
                        }
                    }

                    let screens = cinemaService.screens(for: selectedCinemaID)
                    Picker("Screen", selection: $selectedScreenID) {
                        ForEach(screens) { s in
                            Text(s.name).tag(s.id)
                        }
                    }
                }

                Section("Schedule & Pricing") {
                    DatePicker("Start Time", selection: $startTime)
                    TextField("Standard Price (LKR)", text: $standardPrice)
                        .keyboardType(.numberPad)
                }

                if let err = errorMessage {
                    Text(err)
                        .font(.caption)
                        .foregroundStyle(AppTheme.danger)
                }
            }
            .onAppear {
                if let m = movieService.publishedMovies.first { selectedMovieID = m.id }
                if let c = cinemaService.cinemas.first {
                    selectedCinemaID = c.id
                    if let s = cinemaService.screens(for: c.id).first {
                        selectedScreenID = s.id
                    }
                }
            }
            .navigationTitle("Schedule New Show")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Schedule") {
                        scheduleShow()
                    }
                    .fontWeight(.bold)
                }
            }
        }
    }

    private func scheduleShow() {
        let movie = movieService.movies.first(where: { $0.id == selectedMovieID })
        let runtimeMinutes = movie?.runtimeMinutes ?? 120
        let endTime = startTime.addingTimeInterval(Double(runtimeMinutes * 60))
        let price = Double(standardPrice) ?? 1000.0

        let newShow = Show(
            movieID: selectedMovieID,
            cinemaID: selectedCinemaID,
            screenID: selectedScreenID,
            startTime: startTime,
            endTime: endTime,
            priceStandard: price,
            pricePremium: price * 1.5,
            priceVIP: price * 2.0
        )

        let result = showService.addShow(newShow)
        if result.success {
            dismiss()
        } else {
            errorMessage = result.message
        }
    }
}
