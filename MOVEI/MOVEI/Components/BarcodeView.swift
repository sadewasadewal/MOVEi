//
//  BarcodeView.swift
//  MOVEI
//

import SwiftUI

public struct BarcodeView: View {
    public let value: String
    public var type: TicketCodeType = .code128

    public init(value: String, type: TicketCodeType = .code128) {
        self.value = value
        self.type = type
    }

    public var body: some View {
        Group {
            if let image = BarcodeGenerator.generateBarcode(from: value, type: type) {
                Image(uiImage: image)
                    .resizable()
                    .interpolation(.none)
                    .scaledToFit()
            } else {
                VStack(spacing: 6) {
                    Image(systemName: "barcode")
                        .font(.largeTitle)
                    Text(value)
                        .font(.caption.monospaced())
                }
                .foregroundStyle(AppTheme.muted)
            }
        }
    }
}
