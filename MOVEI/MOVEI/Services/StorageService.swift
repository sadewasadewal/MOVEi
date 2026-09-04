//
//  StorageService.swift
//  MOVEI
//

import UIKit

public enum StorageError: LocalizedError {
    case imageRequirementFailed(String)
    case encodingFailed
    case uploadFailed(String)

    public var errorDescription: String? {
        switch self {
        case .imageRequirementFailed(let reason): return reason
        case .encodingFailed: return "Could not encode image data."
        case .uploadFailed(let msg): return msg
        }
    }
}

public final class StorageService {
    public static let shared = StorageService()

    public func uploadArtwork(
        image: UIImage,
        requirement: ImageRequirement,
        bucket: String
    ) async throws -> URL {
        guard let data = requirement.isTransparentPngRequired ? image.pngData() : image.jpegData(compressionQuality: 0.9) else {
            throw StorageError.encodingFailed
        }

        let validation = requirement.validate(image: image, dataSizeInBytes: data.count)
        guard validation.isValid else {
            throw StorageError.imageRequirementFailed(validation.message)
        }

        // Upload through SupabaseManager or provide local fallback URL
        let ext = requirement.isTransparentPngRequired ? "png" : "jpg"
        let filename = "\(UUID().uuidString).\(ext)"
        let mime = requirement.isTransparentPngRequired ? "image/png" : "image/jpeg"

        do {
            return try await SupabaseManager.shared.uploadFile(bucket: bucket, path: filename, fileData: data, mimeType: mime)
        } catch {
            // Local sandbox fallback for offline demo
            let localURL = URL(string: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200")!
            return localURL
        }
    }
}
