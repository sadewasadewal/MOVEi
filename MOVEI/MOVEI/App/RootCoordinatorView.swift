//
//  RootCoordinatorView.swift
//  MOVEI
//

import SwiftUI

public struct RootCoordinatorView: View {
    @ObservedObject private var auth = AuthService.shared

    public init() {}

    public var body: some View {
        Group {
            if !auth.isAuthenticated {
                LoginView()
            } else {
                switch auth.currentRole {
                case .customer:
                    CustomerRootView()
                case .admin:
                    AdminRootView()
                case .scanner:
                    ScannerRootView()
                }
            }
        }
        .animation(.spring(response: 0.38, dampingFraction: 0.85), value: auth.currentRole)
        .animation(.easeInOut, value: auth.isAuthenticated)
    }
}
