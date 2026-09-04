//
//  SupabaseManager.swift
//  MOVEI
//

import Foundation
import Combine

public final class SupabaseManager: ObservableObject {
    public static let shared = SupabaseManager()

    @Published public var currentSessionToken: String?
    @Published public var currentUserID: UUID?
    @Published public var isConnectedToCloud: Bool = false

    private let session = URLSession.shared
    private let baseURL = MOVEIConfig.supabaseURL
    private let anonKey = MOVEIConfig.supabaseAnonKey

    private init() {
        // Retrieve persisted session token if available
        if let token = UserDefaults.standard.string(forKey: "movei_supabase_token"),
           let uidStr = UserDefaults.standard.string(forKey: "movei_supabase_uid"),
           let uid = UUID(uuidString: uidStr) {
            self.currentSessionToken = token
            self.currentUserID = uid
        }
    }

    public func setSession(token: String, userID: UUID) {
        self.currentSessionToken = token
        self.currentUserID = userID
        UserDefaults.standard.set(token, forKey: "movei_supabase_token")
        UserDefaults.standard.set(userID.uuidString, forKey: "movei_supabase_uid")
    }

    public func clearSession() {
        self.currentSessionToken = nil
        self.currentUserID = nil
        UserDefaults.standard.removeObject(forKey: "movei_supabase_token")
        UserDefaults.standard.removeObject(forKey: "movei_supabase_uid")
    }

    public func callRPC<T: Decodable>(functionName: String, parameters: [String: Any]) async throws -> T {
        let endpoint = baseURL.appendingPathComponent("rest/v1/rpc/\(functionName)")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue(anonKey, forHTTPHeaderField: "apikey")
        
        let token = currentSessionToken ?? anonKey
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONSerialization.data(withJSONObject: parameters)

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw NSError(domain: "SupabaseError", code: (response as? HTTPURLResponse)?.statusCode ?? 500, userInfo: [NSLocalizedDescriptionKey: "Server returned error"])
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }

    public func uploadFile(bucket: String, path: String, fileData: Data, mimeType: String) async throws -> URL {
        let endpoint = baseURL.appendingPathComponent("storage/v1/object/\(bucket)/\(path)")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.addValue(mimeType, forHTTPHeaderField: "Content-Type")
        request.addValue(anonKey, forHTTPHeaderField: "apikey")
        
        let token = currentSessionToken ?? anonKey
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpBody = fileData

        let (_, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw NSError(domain: "SupabaseStorageError", code: (response as? HTTPURLResponse)?.statusCode ?? 500, userInfo: [NSLocalizedDescriptionKey: "Failed to upload image"])
        }

        // Public URL
        return baseURL.appendingPathComponent("storage/v1/object/public/\(bucket)/\(path)")
    }
}
