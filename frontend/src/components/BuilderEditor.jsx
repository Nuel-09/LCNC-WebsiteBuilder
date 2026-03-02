import React, { useEffect, useState, useMemo } from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import {
  getConfiguration,
  saveConfiguration,
} from "../services/configurationService";
import { getDefaultLayout, puckConfig } from "./puckConfig";

/**
 * BuilderEditor Component
 * 
 * Wraps Puck visual editor and integrates with backend configuration API.
 * Manages:
 * - Loading saved configurations from backend
 * - Saving editor state back to backend
 * - Preview mode for live updates
 * - Error handling and user feedback
 */
const BuilderEditor = ({ token, projectId, onPreviewUpdate, onViewPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Define available components for the editor
  // Users will drag these onto the canvas and customize their properties
  const config = useMemo(() => puckConfig, []);

  // Load initial configuration from backend
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const config = await getConfiguration(token, projectId);
        
        // Parse stored JSON or use default starter layout
        const parsedConfig = config.configJson
          ? JSON.parse(config.configJson)
          : getDefaultLayout();
        
        setInitialData(parsedConfig);
      } catch (err) {
        console.error("Failed to load configuration:", err);
        setError("Could not load configuration. Starting with default layout.");
        setInitialData(getDefaultLayout());
      } finally {
        setIsLoading(false);
      }
    };

    if (token && projectId) {
      loadConfiguration();
    }
  }, [token, projectId]);

  // Save configuration to backend
  const handleSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      const configJson = JSON.stringify(data, null, 2);
      
      await saveConfiguration(token, projectId, configJson);
      
      setLastSaved(new Date().toLocaleTimeString());
      
      // Notify parent component to update preview
      if (onPreviewUpdate) {
        onPreviewUpdate(data);
      }
    } catch (err) {
      console.error("Failed to save configuration:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Loading editor...
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#d32f2f",
          background: "#ffebee",
          borderRadius: "4px",
          margin: "20px 0",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header with save button and status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
            Visual Editor
          </h3>
          {lastSaved && (
            <small style={{ color: "#999" }}>
              Last saved: {lastSaved}
            </small>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onViewPage?.(initialData)}
            disabled={!initialData}
            style={{
              background: "white",
              color: "#111",
              padding: "8px 16px",
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              cursor: !initialData ? "not-allowed" : "pointer",
              fontSize: "0.9em",
              fontWeight: "bold",
            }}
          >
            View page
          </button>
          <button
            type="button"
            onClick={() => initialData && handleSave(initialData)}
            disabled={isSaving}
            style={{
              background: isSaving ? "#ccc" : "#3b5ccc",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "0.9em",
              fontWeight: "bold",
            }}
          >
            {isSaving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Puck Editor */}
      {initialData && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <Puck
            config={config}
            data={initialData}
            onPublish={(data) => {
              setInitialData(data);
              handleSave(data);
            }}
            onData={(data) => setInitialData(data)}
          />
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fff3cd",
            color: "#856404",
            borderTop: "1px solid #ffc107",
            fontSize: "0.9em",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default BuilderEditor;
