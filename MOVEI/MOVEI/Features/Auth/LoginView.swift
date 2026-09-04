//
//  LoginView.swift
//  MOVEI
//

import SwiftUI

public struct LoginView: View {
    @ObservedObject private var auth = AuthService.shared
    @State private var email = ""
    @State private var password = ""
    @State private var showRegister = false

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Logo & Header
                    VStack(spacing: 8) {
                        HStack(spacing: 4) {
                            Text("MOVEI")
                                .font(.system(size: 38, weight: .black, design: .rounded))
                            Text("•")
                                .font(.title)
                                .foregroundStyle(AppTheme.lime)
                        }
                        Text("CINEMA PLATFORM")
                            .font(.caption.weight(.bold))
                            .tracking(3)
                            .foregroundStyle(AppTheme.muted)
                    }
                    .padding(.top, 40)

                    // Input fields
                    VStack(spacing: 14) {
                        TextField("Email Address", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding(16)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16))

                        SecureField("Password", text: $password)
                            .padding(16)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16))

                        Button {
                            Task {
                                _ = await auth.signIn(email: email, password: password)
                            }
                        } label: {
                            if auth.isLoading {
                                ProgressView().tint(.white)
                            } else {
                                Text("Sign In")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 52)
                                    .background(AppTheme.ink, in: Capsule())
                            }
                        }
                    }
                    .padding(.horizontal, 24)

                    // Quick Switch Demo Role
                    VStack(spacing: 12) {
                        Text("OR SELECT DEMO PERSONA")
                            .font(.system(size: 10, weight: .bold))
                            .tracking(1.4)
                            .foregroundStyle(AppTheme.muted)

                        HStack(spacing: 10) {
                            DemoRoleButton(title: "Customer", icon: "person.fill", role: .customer)
                            DemoRoleButton(title: "Scanner", icon: "qrcode.viewfinder", role: .scanner)
                            DemoRoleButton(title: "Admin", icon: "shield.fill", role: .admin)
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 12)

                    Spacer(minLength: 30)

                    Button {
                        showRegister = true
                    } label: {
                        HStack(spacing: 4) {
                            Text("Don't have an account?")
                                .foregroundStyle(AppTheme.muted)
                            Text("Create Account")
                                .fontWeight(.bold)
                                .foregroundStyle(AppTheme.ink)
                        }
                        .font(.subheadline)
                    }
                    .padding(.bottom, 24)
                }
            }
            .background(AppTheme.canvas.ignoresSafeArea())
            .sheet(isPresented: $showRegister) {
                RegisterView()
            }
        }
    }
}

private struct DemoRoleButton: View {
    let title: String
    let icon: String
    let role: UserRole

    var body: some View {
        Button {
            AuthService.shared.switchDemoRole(to: role)
        } label: {
            VStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.headline)
                Text(title)
                    .font(.caption2.weight(.bold))
            }
            .foregroundStyle(AppTheme.ink)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .shadow(color: .black.opacity(0.04), radius: 4, y: 2)
        }
    }
}
