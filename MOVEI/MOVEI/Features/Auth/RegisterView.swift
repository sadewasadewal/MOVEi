//
//  RegisterView.swift
//  MOVEI
//

import SwiftUI

public struct RegisterView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var auth = AuthService.shared
    @State private var fullName = ""
    @State private var email = ""
    @State private var password = ""

    public init() {}

    public var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                VStack(spacing: 6) {
                    Text("Create Account")
                        .font(.title2.bold())
                    Text("Join MOVEI for cinema tickets & collectibles")
                        .font(.caption)
                        .foregroundStyle(AppTheme.muted)
                }
                .padding(.top, 24)

                VStack(spacing: 12) {
                    TextField("Full Name", text: $fullName)
                        .padding(16)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))

                    TextField("Email Address", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .padding(16)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))

                    SecureField("Password (min 6 characters)", text: $password)
                        .padding(16)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))

                    Button {
                        Task {
                            let ok = await auth.register(fullName: fullName, email: email, password: password)
                            if ok { dismiss() }
                        }
                    } label: {
                        Text("Register")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(AppTheme.ink, in: Capsule())
                    }
                    .disabled(fullName.isEmpty || email.isEmpty || password.count < 6)
                }
                .padding(.horizontal, 24)

                Spacer()
            }
            .background(AppTheme.canvas.ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
}
