//
//  ScannerCameraView.swift
//  MOVEI
//

import SwiftUI
import AVFoundation

public struct ScannerCameraView: View {
    @ObservedObject private var scannerService = ScannerService.shared
    @State private var manualBarcode = ""
    @State private var activeAdmissionResult: AdmissionResult?
    @State private var isFlashOn = false

    public init() {}

    public var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(spacing: 20) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("SCANNER MODE")
                                .font(.system(size: 10, weight: .black))
                                .tracking(1.5)
                                .foregroundStyle(AppTheme.lime)
                            Text(scannerService.assignedCinema.name)
                                .font(.headline)
                                .foregroundStyle(.white)
                        }
                        Spacer()
                        Button {
                            isFlashOn.toggle()
                        } label: {
                            Image(systemName: isFlashOn ? "bolt.fill" : "bolt.slash.fill")
                                .font(.title3)
                                .foregroundStyle(.white)
                                .padding(10)
                                .background(Color.white.opacity(0.15), in: Circle())
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 16)

                    Spacer()

                    // Visual Viewfinder / Scan Target
                    ZStack {
                        RoundedRectangle(cornerRadius: 24)
                            .stroke(AppTheme.lime, style: StrokeStyle(lineWidth: 3, dash: [40, 20]))
                            .frame(width: 280, height: 200)

                        VStack(spacing: 8) {
                            Image(systemName: "barcode.viewfinder")
                                .font(.system(size: 56))
                                .foregroundStyle(AppTheme.lime)
                            Text("Align Code 128 or QR within frame")
                                .font(.caption2.weight(.bold))
                                .foregroundStyle(.white.opacity(0.7))
                        }
                    }

                    Spacer()

                    // Quick Manual Entry & Simulator Test Buttons
                    VStack(spacing: 12) {
                        HStack(spacing: 8) {
                            TextField("Enter barcode (e.g. MOV-75EB31-01)", text: $manualBarcode)
                                .padding(14)
                                .background(Color.white.opacity(0.12))
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))

                            Button {
                                guard !manualBarcode.isEmpty else { return }
                                let result = scannerService.validateTicket(barcode: manualBarcode)
                                activeAdmissionResult = result
                                manualBarcode = ""
                            } label: {
                                Text("Verify")
                                    .font(.subheadline.bold())
                                    .foregroundStyle(AppTheme.ink)
                                    .padding(.horizontal, 16)
                                    .frame(height: 48)
                                    .background(AppTheme.lime)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                        .padding(.horizontal, 24)

                        // Quick Test simulator shortcuts
                        HStack(spacing: 8) {
                            Button("Test Valid Ticket") {
                                let result = scannerService.validateTicket(barcode: "MOV-75EB31-01")
                                activeAdmissionResult = result
                            }
                            .font(.caption2.bold())
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.15))
                            .foregroundStyle(.white)
                            .clipShape(Capsule())

                            Button("Test Duplicate Scan") {
                                let result = scannerService.validateTicket(barcode: "MOV-19FB02-01")
                                activeAdmissionResult = result
                            }
                            .font(.caption2.bold())
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.15))
                            .foregroundStyle(.white)
                            .clipShape(Capsule())
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
            .sheet(item: Binding(get: { activeAdmissionResult != nil ? AdmissionResultWrapper(result: activeAdmissionResult!) : nil }, set: { _ in activeAdmissionResult = nil })) { wrapper in
                ScanResultModalView(result: wrapper.result)
            }
        }
    }
}

public struct AdmissionResultWrapper: Identifiable {
    public var id: String { result.ticketCode }
    public let result: AdmissionResult
}

public struct ScanResultModalView: View {
    @Environment(\.dismiss) private var dismiss
    public let result: AdmissionResult

    public var body: some View {
        VStack(spacing: 20) {
            // Status Icon
            Image(systemName: iconName)
                .font(.system(size: 64))
                .foregroundStyle(statusColor)
                .padding(.top, 32)

            VStack(spacing: 6) {
                Text(result.title)
                    .font(.title2.weight(.black))
                    .foregroundStyle(statusColor)
                Text(result.message)
                    .font(.subheadline)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(AppTheme.muted)
                    .padding(.horizontal, 24)
            }

            // Ticket Details Card if available
            if let movie = result.movieTitle {
                VStack(spacing: 12) {
                    HStack {
                        Text("MOVIE")
                            .font(.caption2.bold())
                            .foregroundStyle(AppTheme.muted)
                        Spacer()
                        Text(movie)
                            .font(.subheadline.bold())
                    }

                    if let cinema = result.cinemaName {
                        HStack {
                            Text("VENUE")
                                .font(.caption2.bold())
                                .foregroundStyle(AppTheme.muted)
                            Spacer()
                            Text(cinema)
                                .font(.subheadline.bold())
                        }
                    }

                    if let screen = result.screenName, let seat = result.seat {
                        HStack {
                            Text("SCREEN & SEAT")
                                .font(.caption2.bold())
                                .foregroundStyle(AppTheme.muted)
                            Spacer()
                            Text("\(screen) · Seat \(seat)")
                                .font(.subheadline.bold())
                        }
                    }

                    if let name = result.customerName {
                        HStack {
                            Text("CUSTOMER")
                                .font(.caption2.bold())
                                .foregroundStyle(AppTheme.muted)
                            Spacer()
                            Text(name)
                                .font(.subheadline.bold())
                        }
                    }
                }
                .padding(20)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 18))
                .padding(.horizontal, 24)
            }

            Spacer()

            Button {
                dismiss()
            } label: {
                Text("Dismiss & Scan Next")
                    .font(.headline.weight(.bold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(statusColor, in: Capsule())
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
        .background(AppTheme.canvas.ignoresSafeArea())
    }

    private var statusColor: Color {
        switch result.statusType {
        case .valid: return AppTheme.success
        case .alreadyUsed: return AppTheme.warning
        default: return AppTheme.danger
        }
    }

    private var iconName: String {
        switch result.statusType {
        case .valid: return "checkmark.seal.fill"
        case .alreadyUsed: return "exclamationmark.triangle.fill"
        case .wrongCinema: return "building.2.crop.circle.badge.xmark"
        default: return "xmark.octagon.fill"
        }
    }
}
