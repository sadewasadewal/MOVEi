//
//  ImageUploaderView.swift
//  MOVEI
//

import SwiftUI
import PhotosUI

public struct ImageUploaderView: View {
    public let requirement: ImageRequirement
    @Binding public var imageURL: String
    @State private var selectedItem: PhotosPickerItem?
    @State private var selectedImage: UIImage?
    @State private var validationResult: ImageRequirement.ValidationResult?
    @State private var isUploading = false

    public init(requirement: ImageRequirement, imageURL: Binding<String>) {
        self.requirement = requirement
        self._imageURL = imageURL
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(requirement.name.uppercased())
                .font(.caption.weight(.bold))
                .tracking(1.4)
                .foregroundStyle(AppTheme.muted)

            HStack(spacing: 16) {
                // Image preview box
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(AppTheme.canvas)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.gray.opacity(0.2), lineWidth: 1))

                    if let selectedImage = selectedImage {
                        Image(uiImage: selectedImage)
                            .resizable()
                            .scaledToFill()
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    } else if !imageURL.isEmpty, let url = URL(string: imageURL) {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .success(let img):
                                img.resizable().scaledToFill().clipShape(RoundedRectangle(cornerRadius: 14))
                            default:
                                ProgressView()
                            }
                        }
                    } else {
                        VStack(spacing: 6) {
                            Image(systemName: "photo.badge.plus")
                                .font(.title2)
                            Text(requirement.ratioLabel)
                                .font(.caption2.weight(.bold))
                        }
                        .foregroundStyle(AppTheme.muted)
                    }
                }
                .frame(width: 90, height: 90 / CGFloat(requirement.aspectRatio))
                .clipped()

                // Requirement info & button
                VStack(alignment: .leading, spacing: 6) {
                    Text("Required Ratio: \(requirement.ratioLabel)")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(AppTheme.ink)

                    Text("Recommended: \(requirement.recommendedLabel)")
                        .font(.caption2)
                        .foregroundStyle(AppTheme.muted)

                    Text("Max Size: \(Int(requirement.maximumFileSizeMB)) MB")
                        .font(.caption2)
                        .foregroundStyle(AppTheme.muted)

                    PhotosPicker(selection: $selectedItem, matching: .images) {
                        HStack(spacing: 6) {
                            Image(systemName: "arrow.triangle.2.circlepath")
                            Text(imageURL.isEmpty ? "Select Image" : "Change Image")
                        }
                        .font(.caption.weight(.bold))
                        .foregroundStyle(AppTheme.ink)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.white)
                        .clipShape(Capsule())
                        .shadow(color: .black.opacity(0.06), radius: 4, y: 2)
                    }
                    .onChange(of: selectedItem) { _, newItem in
                        Task {
                            if let data = try? await newItem?.loadTransferable(type: Data.self),
                               let uiImage = UIImage(data: data) {
                                selectedImage = uiImage
                                let result = requirement.validate(image: uiImage, dataSizeInBytes: data.count)
                                validationResult = result
                                if result.isValid {
                                    // Upload
                                    isUploading = true
                                    let url = try? await StorageService.shared.uploadArtwork(
                                        image: uiImage,
                                        requirement: requirement,
                                        bucket: MOVEIConfig.Buckets.moviePosters
                                    )
                                    if let url = url {
                                        imageURL = url.absoluteString
                                    }
                                    isUploading = false
                                }
                            }
                        }
                    }
                }
            }

            if let result = validationResult {
                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 6) {
                        Image(systemName: result.isRatioAcceptable ? "checkmark.circle.fill" : "xmark.circle.fill")
                            .foregroundStyle(result.isRatioAcceptable ? AppTheme.success : AppTheme.danger)
                        Text(result.isRatioAcceptable ? "Correct aspect ratio" : "Incorrect aspect ratio")
                    }
                    .font(.caption2.weight(.semibold))

                    HStack(spacing: 6) {
                        Image(systemName: result.isResolutionAcceptable ? "checkmark.circle.fill" : "xmark.circle.fill")
                            .foregroundStyle(result.isResolutionAcceptable ? AppTheme.success : AppTheme.danger)
                        Text(result.isResolutionAcceptable ? "Resolution acceptable" : "Resolution too low")
                    }
                    .font(.caption2.weight(.semibold))

                    HStack(spacing: 6) {
                        Image(systemName: result.isFileSizeAcceptable ? "checkmark.circle.fill" : "xmark.circle.fill")
                            .foregroundStyle(result.isFileSizeAcceptable ? AppTheme.success : AppTheme.danger)
                        Text(result.isFileSizeAcceptable ? "File size acceptable" : "File exceeds maximum limit")
                    }
                    .font(.caption2.weight(.semibold))
                }
                .padding(.top, 4)
            }
        }
        .padding(16)
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

public struct ToastBanner: View {
    public let message: String
    public var isError: Bool = false

    public init(message: String, isError: Bool = false) {
        self.message = message
        self.isError = isError
    }

    public var body: some View {
        HStack(spacing: 10) {
            Image(systemName: isError ? "exclamationmark.triangle.fill" : "checkmark.seal.fill")
                .foregroundStyle(isError ? AppTheme.danger : AppTheme.lime)
            Text(message)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
            Spacer()
        }
        .padding(16)
        .background(AppTheme.ink.opacity(0.95))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.2), radius: 10, y: 5)
        .padding(.horizontal, 20)
    }
}
