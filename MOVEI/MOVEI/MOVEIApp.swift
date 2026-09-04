//
//  MOVEIApp.swift
//  MOVEI
//
//  Created by Sandew on 03/09/2026.
//

import SwiftUI
import SwiftData

@main
struct MOVEIApp: App {
    var body: some Scene {
        WindowGroup {
            RootCoordinatorView()
        }
        .modelContainer(for: TicketRecord.self)
    }
}
