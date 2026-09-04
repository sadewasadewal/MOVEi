//
//  ImageRequirement.swift
//  MOVEI
//

import UIKit

public struct ImageRequirement {
    public let name: String
    public let width: Int
    public let height: Int
    public let aspectRatio: Double
    public let minWidth: Int
    public let minHeight: Int
    public let maximumFileSizeMB: Double
    public let ratioLabel: String
    public let recommendedLabel: String
    public let isTransparentPngRequired: Bool

    public init(
        name: String,
        width: Int,
        height: Int,
        aspectRatio: Double,
        minWidth: Int,
        minHeight: Int,
        maximumFileSizeMB: Double,
        ratioLabel: String,
        recommendedLabel: String,
        isTransparentPngRequired: Bool
    ) {
        self.name = name
        self.width = width
        self.height = height
        self.aspectRatio = aspectRatio
        self.minWidth = minWidth
        self.minHeight = minHeight
        self.maximumFileSizeMB = maximumFileSizeMB
        self.ratioLabel = ratioLabel
        self.recommendedLabel = recommendedLabel
        self.isTransparentPngRequired = isTransparentPngRequired
    }

    public struct ValidationResult {
        public let isRatioAcceptable: Bool
        public let isResolutionAcceptable: Bool
        public let isFileSizeAcceptable: Bool
        public let isFormatAcceptable: Bool

        public var isValid: Bool {
            isRatioAcceptable && isResolutionAcceptable && isFileSizeAcceptable && isFormatAcceptable
        }

        public var message: String {
            if !isRatioAcceptable {
                return "Must match the required aspect ratio closely."
            }
            if !isResolutionAcceptable {
                return "Resolution is below minimum required quality."
            }
            if !isFileSizeAcceptable {
                return "File exceeds the maximum upload limit."
            }
            if !isFormatAcceptable {
                return "Must be a transparent PNG format."
            }
            return "Artwork requirements satisfied."
        }
    }

    public func validate(image: UIImage, dataSizeInBytes: Int) -> ValidationResult {
        let pixelWidth = image.size.width * image.scale
        let pixelHeight = image.size.height * image.scale
        let actualRatio = pixelWidth / max(pixelHeight, 1.0)
        
        let ratioTolerance = 0.08
        let isRatioValid = abs(actualRatio - aspectRatio) <= ratioTolerance
        let isResValid = pixelWidth >= CGFloat(minWidth) && pixelHeight >= CGFloat(minHeight)
        let fileSizeMB = Double(dataSizeInBytes) / (1024.0 * 1024.0)
        let isSizeValid = fileSizeMB <= maximumFileSizeMB

        return ValidationResult(
            isRatioAcceptable: isRatioValid,
            isResolutionAcceptable: isResValid,
            isFileSizeAcceptable: isSizeValid,
            isFormatAcceptable: true
        )
    }
}
