//
//  BarcodeGenerator.swift
//  MOVEI
//

import UIKit
import CoreImage.CIFilterBuiltins

public enum TicketCodeType {
    case code128
    case qr
}

public enum BarcodeGenerator {
    private static let context = CIContext()

    public static func generateBarcode(from string: String, type: TicketCodeType = .code128) -> UIImage? {
        let data = Data(string.utf8)

        let outputImage: CIImage?
        switch type {
        case .code128:
            let filter = CIFilter.code128BarcodeGenerator()
            filter.message = data
            outputImage = filter.outputImage
        case .qr:
            let filter = CIFilter.qrCodeGenerator()
            filter.message = data
            filter.correctionLevel = "M"
            outputImage = filter.outputImage
        }

        guard let ciImage = outputImage else { return nil }
        
        let transform = CGAffineTransform(scaleX: 10, y: 10)
        let scaledImage = ciImage.transformed(by: transform)

        if let cgImage = context.createCGImage(scaledImage, from: scaledImage.extent) {
            return UIImage(cgImage: cgImage)
        }
        return nil
    }
}
