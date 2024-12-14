import { useState, useRef, useEffect } from "react";
import { Pencil,NotebookPen } from "lucide-react";
import { useLocation } from "react-router-dom";

const NotebookWriter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [segments, setSegments] = useState([]);
  const [editingSegment, setEditingSegment] = useState(null);
  const [newSegmentContent, setNewSegmentContent] = useState("");
  const [isAddingSegment, setIsAddingSegment] = useState(false);

  const writerRef = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (writerRef.current && !writerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/notebook/get-chats", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotebooks(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleNotebookSelect = (notebookId) => {
    setSelectedNotebook(notebookId);

    fetch(`http://localhost:3000/api/notebook/${notebookId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSegments(data.data.segments);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAddProject = () => {
    // const newNotebookTitle = prompt("Enter a title for the new project:");
    const date = new Date();
    const newNotebookTitle = `Notebook ${date.toISOString()}`;
    // const notebookDate = date.toISOString()
    if (newNotebookTitle) {
      fetch("http://localhost:3000/api/notebook/create-notebook", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newNotebookTitle }),
      })
        .then((response) => response.json())
        .then((data) => {
          setNotebooks([...notebooks, data.data]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleEditSegment = (segmentId) => {
    const segment = segments.find((seg) => seg.segmentId === segmentId);
    setEditingSegment(segmentId);
    setNewSegmentContent(segment?.notes || "");
  };

  const saveEditedSegment = () => {
    fetch(
      `http://localhost:3000/api/notebook/${selectedNotebook}/update-segment/${editingSegment}`,
      {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: newSegmentContent }),
      }
    )
      .then(() => {
        setSegments(
          segments.map((segment) =>
            segment.segmentId === editingSegment
              ? { ...segment, notes: newSegmentContent }
              : segment
          )
        );
        setEditingSegment(null);
        setNewSegmentContent("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAddSegment = () => {
    setIsAddingSegment(true);
    setNewSegmentContent("");
  };

  const isUploadPath = /^\/upload\/[^/]+$/.test(location.pathname); // Matches `/upload/<id>`
  const isHomePath = /^\/[^/]+$/.test(location.pathname) && !isUploadPath; // Matches `/<id>` but not `/upload/<id>`

  // Assign the pathname to a constant if it matches either
  const matchedPathname = isUploadPath || isHomePath ? location.pathname : null;

  const saveNewSegment = () => {
    fetch(
      `http://localhost:3000/api/notebook/${selectedNotebook}/add-segment`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: newSegmentContent,
          link: matchedPathname,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSegments(data.data.segments);
        setIsAddingSegment(false);
        setNewSegmentContent("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="fixed top-4 right-4 px-4 py-2 rounded dark:text-PrimaryLight text-PrimaryBlack flex gap-3 items-center"
      >
        Add Notes
        <Pencil size={18} color="gray" />
      </button>

      {isOpen && (
        <div
          ref={writerRef}
          className=" h-screen w-[400px] p-4 dark:bg-PrimaryGrayLighter bg-TertiaryWhite overflow-y-auto"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 50,
          }}
        >
          <h2 className="text-xl dark:text-PrimaryLight text-PrimaryBlack mb-4">Notebook Writer</h2>
          <button className="bg-PrimaryBlue rounded-md p-2 w-full mb-4" onClick={handleAddProject}>
            Create Notebook
          </button>
          <select
            className="w-full p-2 mb-4 dark:bg-PrimaryGrayLight bg-SecondaryWhite dark:text-PrimaryLight text-black"
            onChange={(e) => handleNotebookSelect(e.target.value)}
            value={selectedNotebook || ""}
          >
            <option value="" disabled>
              Select a notebook
            </option>
            {notebooks.map((notebook) => (
              <option key={notebook?.notebookId} value={notebook?.notebookId}>
                {notebook?.title}
              </option>
            ))}
          </select>

          {segments.map((segment) => (
            <div
              key={segment.segmentId}
              className="bg-PrimaryBlack p-4 mb-4 rounded shadow"
            >
              {editingSegment === segment.segmentId ? (
                <>
                  <textarea
                    value={newSegmentContent}
                    onChange={(e) => setNewSegmentContent(e.target.value)}
                    className="w-full p-3 text-sm text-PrimaryDark bg-PrimaryDark border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={saveEditedSegment}
                      className="px-4 py-2 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSegment(null)}
                      className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-PrimaryLight whitespace-pre-line">
                    {segment?.notes}
                  </p>
                  <button
                    className="mt-2 text-sm font-medium text-blue-500 hover:underline"
                    onClick={() => handleEditSegment(segment?.segmentId)}
                  >
                    Edit Segment
                  </button>
                </>
              )}
            </div>
          ))}
          {selectedNotebook && (
            <button
              className="mt-2 text-sm font-medium text-blue-500 hover:underline"
              onClick={() => handleAddSegment()}
            >
              Add Segment
            </button>
          )}

          {isAddingSegment && (
            <div className="mt-4 dark:bg-PrimaryGrayLight bg-[#8AA6FA] p-4 rounded shadow">
              <textarea
                value={newSegmentContent}
                onChange={(e) => {
                  console.log("New content:", e.target.value); // Debug log
                  setNewSegmentContent(e.target.value);
                }}
                className="w-full p-3 text-sm bg-PrimaryDark border border-gray-600 rounded 
    focus:outline-none focus:ring focus:ring-blue-500 text-PrimaryGrayLight" // Changed text color to white
                rows={4}
                placeholder="Enter notes for the new segment"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={saveNewSegment}
                  className="px-4 py-2 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Save Segment
                </button>
                <button
                  onClick={() => setIsAddingSegment(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotebookWriter;
