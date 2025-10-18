use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: Option<i64>,
    pub name: String,
    pub color: String,
    pub archived: bool,
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeEntry {
    pub id: Option<i64>,
    pub project_id: i64,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_seconds: Option<i64>,
    pub notes: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StartTimerRequest {
    pub project_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StopTimerRequest {
    pub entry_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTimeEntryRequest {
    pub id: i64,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeEntryWithProject {
    pub id: i64,
    pub project_id: i64,
    pub project_name: String,
    pub project_color: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_seconds: Option<i64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectStats {
    pub project_id: i64,
    pub project_name: String,
    pub project_color: String,
    pub total_seconds: i64,
    pub entry_count: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyStats {
    pub date: String,
    pub total_seconds: i64,
}
