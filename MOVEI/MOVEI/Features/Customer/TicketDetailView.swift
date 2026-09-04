//
//  TicketDetailView.swift
//  MOVEI
//

import SwiftUI

public struct TicketDetailView: View {
    public let ticket: Ticket
    public let onDone: () -> Void
    @State private var isTorn = false
    @State private var isAddingToWallet = false
    @State private var walletStatusMessage: String?

    public init(ticket: Ticket, onDone: @escaping () -> Void) {
        self.ticket = ticket
        self.onDone = onDone
    }

    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 16) {
                // Top Navigation Bar
                HStack {
                    Button {
                        onDone()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "chevron.left")
                                .font(.subheadline.weight(.bold))
                            Text("Wallet")
                                .font(.subheadline.weight(.semibold))
                        }
                        .foregroundStyle(AppTheme.ink)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(.regularMaterial, in: Capsule())
                    }
                    .accessibilityLabel("Go back to Wallet")

                    Spacer()

                    Button {
                        UIPasteboard.general.string = ticket.ticketCode
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title3)
                            .frame(width: 44, height: 44)
                            .background(.regularMaterial, in: Circle())
                    }
                    .accessibilityLabel("Copy ticket code")
                }
                .foregroundStyle(AppTheme.ink)
                .padding(.horizontal, 20)
                .padding(.top, 8)

                // The Ticket Assembly
                VStack(spacing: isTorn ? 18 : 0) {
                    // TOP HALF: Movie Pass
                    VStack(spacing: 0) {
                        ZStack(alignment: .top) {
                            AsyncImage(url: URL(string: ticket.backdropURL)) { image in
                                image.resizable().scaledToFill()
                            } placeholder: {
                                Rectangle().fill(Color.orange)
                            }
                            .frame(height: 350)
                            .clipped()

                            LinearGradient(colors: [.black.opacity(0.25), .clear], startPoint: .top, endPoint: .center)

                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 3) {
                                    Text("MOVEI").font(.title3.weight(.black))
                                    Text("CINEMA").font(.caption2.weight(.bold)).tracking(1.8)
                                }
                                Spacer()
                                VStack(alignment: .trailing, spacing: 3) {
                                    Text(ticket.showtime, format: .dateTime.month(.abbreviated).day()).font(.headline.weight(.bold))
                                    Text(ticket.showtime, format: .dateTime.hour().minute()).font(.subheadline.weight(.semibold))
                                }
                            }
                            .foregroundStyle(.white)
                            .padding(20)
                        }

                        ZStack(alignment: .bottomLeading) {
                            AppTheme.ink
                            VStack(alignment: .leading, spacing: 16) {
                                Text(ticket.movieTitle).font(.system(size: 28, weight: .bold, design: .rounded))
                                HStack(alignment: .bottom) {
                                    PassDetail(label: "VENUE", value: ticket.cinemaName, lightText: true)
                                    Spacer()
                                    PassDetail(label: "SCREEN", value: ticket.screenName, lightText: true)
                                    PassDetail(label: "SEATS", value: ticket.seatLabel, lightText: true)
                                }
                            }
                            .padding(22)
                        }
                        .frame(height: 142)
                        .foregroundStyle(.white)

                        // Dotted Perforation Bar
                        InteractiveTicketTearBar(isTorn: $isTorn)
                    }
                    .clipShape(
                        UnevenRoundedRectangle(
                            topLeadingRadius: 25,
                            bottomLeadingRadius: isTorn ? 16 : 0,
                            bottomTrailingRadius: isTorn ? 16 : 0,
                            topTrailingRadius: 25
                        )
                    )
                    .shadow(color: .black.opacity(0.12), radius: 14, y: 6)

                    // BOTTOM STUB: Barcode section
                    VStack(spacing: 12) {
                        ZStack {
                            VStack(spacing: 12) {
                                BarcodeView(value: ticket.barcodeValue)
                                    .frame(height: 128)
                                    .accessibilityLabel("Barcode for ticket \(ticket.ticketCode)")
                                Text(ticket.ticketCode).font(.caption.monospaced()).foregroundStyle(AppTheme.muted)
                            }
                            .opacity(isTorn ? 0.4 : 1.0)

                            // Red ADMITTED ink stamp when torn
                            if isTorn {
                                VStack(spacing: 4) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "checkmark.seal.fill")
                                        Text("ADMITTED")
                                    }
                                    .font(.system(size: 20, weight: .black, design: .rounded))
                                    .tracking(2)

                                    Text(Date(), format: .dateTime.hour().minute().month(.abbreviated).day())
                                        .font(.caption2.weight(.bold))
                                        .tracking(1)
                                }
                                .foregroundStyle(Color.red.opacity(0.9))
                                .padding(.horizontal, 20)
                                .padding(.vertical, 9)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.red.opacity(0.9), style: StrokeStyle(lineWidth: 2, dash: [5, 3]))
                                )
                                .rotationEffect(.degrees(-7))
                                .transition(.opacity)
                            }
                        }

                        if isTorn {
                            Button {
                                withAnimation(.spring(response: 0.38, dampingFraction: 0.82)) {
                                    isTorn = false
                                }
                                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: "arrow.uturn.backward.circle.fill")
                                    Text("Tape Ticket Back")
                                }
                                .font(.caption.weight(.bold))
                                .foregroundStyle(AppTheme.muted)
                                .padding(.vertical, 4)
                            }
                            .transition(.opacity)
                        }
                    }
                    .padding(.horizontal, 22)
                    .padding(.vertical, 18)
                    .background(.white)
                    .clipShape(
                        UnevenRoundedRectangle(
                            topLeadingRadius: isTorn ? 16 : 0,
                            bottomLeadingRadius: 25,
                            bottomTrailingRadius: 25,
                            topTrailingRadius: isTorn ? 16 : 0
                        )
                    )
                    .shadow(color: .black.opacity(0.12), radius: 14, y: 6)
                }
                .padding(.horizontal, 20)
                .animation(.spring(response: 0.4, dampingFraction: 0.8), value: isTorn)

                // PassKit: Add to Apple Wallet button
                Button {
                    Task {
                        isAddingToWallet = true
                        let res = await PassKitService.shared.addPassToAppleWallet(ticket: ticket)
                        isAddingToWallet = false
                        walletStatusMessage = res.message
                    }
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "wallet.pass.fill")
                        Text(isAddingToWallet ? "Adding to Wallet..." : "Add to Apple Wallet")
                    }
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color.black, in: RoundedRectangle(cornerRadius: 16))
                }
                .padding(.horizontal, 20)
                .padding(.top, 4)

                if let msg = walletStatusMessage {
                    Text(msg)
                        .font(.caption2.weight(.bold))
                        .foregroundStyle(AppTheme.lime)
                        .padding(.top, -6)
                }

                // Additional Info Tiles
                VStack(spacing: 0) {
                    PassActionRow(title: "Additional Ticket Info", subtitle: "Cinema entry & booking details", icon: "chevron.right")
                    HStack(spacing: 12) {
                        PassActionTile(title: "Venue", subtitle: "Open in Maps", icon: "mappin.and.ellipse")
                        PassActionTile(title: "Movie", subtitle: "View details", icon: "film")
                    }
                }
                .padding(.horizontal, 20)
            }
            .padding(.bottom, 28)
        }
        .background(AppTheme.canvas.ignoresSafeArea())
    }
}
