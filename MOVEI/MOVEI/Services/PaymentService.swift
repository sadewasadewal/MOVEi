//
//  PaymentService.swift
//  MOVEI
//

import Foundation

public struct PaymentResult {
    public let isSuccess: Bool
    public let transactionID: String
    public let errorMessage: String?

    public init(isSuccess: Bool, transactionID: String, errorMessage: String? = nil) {
        self.isSuccess = isSuccess
        self.transactionID = transactionID
        self.errorMessage = errorMessage
    }
}

public protocol PaymentService {
    func processPayment(amount: Double, currency: String, bookingRef: String) async -> PaymentResult
}

public final class MockPaymentService: PaymentService {
    public static let shared = MockPaymentService()

    public func processPayment(amount: Double, currency: String, bookingRef: String) async -> PaymentResult {
        // Simulate network processing
        try? await Task.sleep(for: .milliseconds(500))
        let txID = "PAY-" + UUID().uuidString.prefix(8).uppercased()
        return PaymentResult(isSuccess: true, transactionID: txID)
    }
}
