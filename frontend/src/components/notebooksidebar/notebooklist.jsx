
import { useState } from "react"



export default function CaseNotes({ caseNumber, title, initialNotes }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [editedNotes, setEditedNotes] = useState(notes)

  const handleSave = () => {
    setNotes(editedNotes)
    setIsEditing(false)
    // Here you would typically send the updated notes to the backend
    // For example: updateNotesOnBackend(editedNotes)
  }

  return (
    <div className="dark:bg-PrimaryGrayDark bg-PrimaryWhite dark:text-white text-black p-6 rounded-lg max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-medium text-gray-400">{caseNumber}</span>
          <h2 className="text-xl">{title}</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Analysis
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? "block" : "hidden"}`}>
        <div className="flex items-center gap-2 text-gray-400">
          <span>Notes</span>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="w-full h-32 px-3 py-2 text-white bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedNotes(notes)
                }}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 leading-relaxed">{notes}</p>
        )}
      </div>
    </div>
  )
}

