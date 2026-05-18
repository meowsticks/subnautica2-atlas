// Survivor's Atlas — Tauri desktop overlay (v3.4)
//
// Wraps the existing index.html as a native desktop window. Adds two custom
// commands the front-end can call to toggle the always-on-top overlay mode
// and to switch decorations (frameless mode for clean overlay aesthetic).

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

#[tauri::command]
fn toggle_overlay(window: tauri::Window) -> Result<(), String> {
    let current = window.is_always_on_top().map_err(|e| e.to_string())?;
    window
        .set_always_on_top(!current)
        .map_err(|e| e.to_string())?;
    window
        .set_decorations(current) // when on top -> hide decorations for overlay feel
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn set_atlas_size(window: tauri::Window, width: u32, height: u32) -> Result<(), String> {
    window
        .set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: width as f64,
            height: height as f64,
        }))
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let win = app.get_window("main").expect("main window missing");
            // Default to floating, not pinned. Toggle via front-end.
            let _ = win.set_always_on_top(false);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![toggle_overlay, set_atlas_size])
        .run(tauri::generate_context!())
        .expect("error while running Survivor's Atlas overlay");
}
