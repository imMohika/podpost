use std::{
    fs::File,
    io::{Read, Seek, SeekFrom},
};

use sha2::{Digest, Sha256};

#[tauri::command]
fn partial_file_hash(file_path: String, chunk_size: usize) -> Result<String, String> {
    let mut file = File::open(&file_path).map_err(|e| e.to_string())?;
    let file_size = file.metadata().map_err(|e| e.to_string())?.len();

    let mut first_chunk = vec![0; chunk_size];
    file.read_exact(&mut first_chunk)
        .map_err(|e| e.to_string())?;

    let mut last_chunk = vec![0; chunk_size];
    if file_size > chunk_size as u64 {
        file.seek(SeekFrom::End(-(chunk_size as i64)))
            .map_err(|e| e.to_string())?;
        file.read_exact(&mut last_chunk)
            .map_err(|e| e.to_string())?;
    }

    let mut hasher = Sha256::new();
    hasher.update(&first_chunk);
    hasher.update(&last_chunk);

    let hash_result = hasher.finalize();
    Ok(format!("{:x}", hash_result))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![partial_file_hash])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
