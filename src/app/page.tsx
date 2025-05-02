"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Subject {
  id: string;
  name: string;
  units: number;
  grade: number;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<{
    name: string;
    units: number;
    grade: number;
  }>({
    name: "",
    units: 0,
    grade: 0,
  });
  const [gwa, setGwa] = useState<number | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Subject | null>(null);

  useEffect(() => {
    const savedSubjects = localStorage.getItem("gwaSubjects");
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gwaSubjects", JSON.stringify(subjects));
    calculateGWA();
  }, [subjects]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.units > 0 && newSubject.grade > 0) {
      setSubjects([
        ...subjects,
        {
          id: crypto.randomUUID(),
          ...newSubject,
        },
      ]);
      setNewSubject({ name: "", units: 0, grade: 0 });
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const calculateGWA = () => {
    if (subjects.length === 0) {
      setGwa(null);
      return;
    }

    let totalWeightedGrade = 0;
    let totalUnits = 0;

    subjects.forEach((subject) => {
      totalWeightedGrade += subject.grade * subject.units;
      totalUnits += subject.units;
    });

    setGwa(totalWeightedGrade / totalUnits);
  };

  const handleEditClick = (subject: Subject) => {
    setEditingSubjectId(subject.id);
    setEditFormData({ ...subject });
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
    setEditFormData(null);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Subject
  ) => {
    if (!editFormData) return;

    if (field === "name") {
      setEditFormData({ ...editFormData, name: e.target.value });
    } else {
      setEditFormData({
        ...editFormData,
        [field]: parseFloat(e.target.value) || 0,
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;

    setSubjects(
      subjects.map((subject) =>
        subject.id === editingSubjectId ? editFormData : subject
      )
    );
    setEditingSubjectId(null);
    setEditFormData(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const reorderedSubjects = Array.from(subjects);
    const [removed] = reorderedSubjects.splice(result.source.index, 1);
    reorderedSubjects.splice(result.destination.index, 0, removed);

    setSubjects(reorderedSubjects);
  };

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        GWA Calculator
      </h1>
      <p className="text-center mb-10 text-gray-600 max-w-2xl mx-auto">
        Calculate your General Weighted Average (GWA) using the formula: GWA = Σ
        (Grade × Units) / Σ Units
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Subject</h2>
          <form onSubmit={addSubject} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 mb-2 font-medium"
              >
                Subject Name
              </label>
              <input
                type="text"
                id="name"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <label
                htmlFor="units"
                className="block text-gray-700 mb-2 font-medium"
              >
                Units
              </label>
              <input
                type="number"
                id="units"
                value={newSubject.units || ""}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    units: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="0.0"
              />
            </div>
            <div>
              <label
                htmlFor="grade"
                className="block text-gray-700 mb-2 font-medium"
              >
                Grade
              </label>
              <input
                type="number"
                id="grade"
                value={newSubject.grade || ""}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    grade: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="0.00"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm"
            >
              Add Subject
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-center min-h-[260px] transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">GWA Result</h2>
          {gwa !== null ? (
            <div className="flex flex-col items-center justify-center flex-grow w-full">
              <div className="text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 transition-all animate-fade-in">
                {gwa.toFixed(2)}
              </div>
              <p className="text-gray-600 font-medium">
                Your General Weighted Average
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 flex-grow flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-xs w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-3 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p>Add subjects to calculate your GWA</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Subject List</h2>
          {subjects.length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">
              {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
            </span>
          )}
        </div>
        {subjects.length > 0 ? (
          <div className="overflow-x-auto -mx-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                      Subject
                    </th>
                    <th className="border-b border-gray-200 p-4 text-center font-semibold text-gray-700">
                      Units
                    </th>
                    <th className="border-b border-gray-200 p-4 text-center font-semibold text-gray-700">
                      Grade
                    </th>
                    <th className="border-b border-gray-200 p-4 text-center font-semibold text-gray-700">
                      Weighted Grade
                    </th>
                    <th className="border-b border-gray-200 p-4 text-center font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="subjects">
                  {(provided) => (
                    <tbody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="divide-y divide-gray-200"
                    >
                      {subjects.map((subject, index) => (
                        <Draggable
                          key={subject.id}
                          draggableId={subject.id}
                          index={index}
                          isDragDisabled={editingSubjectId !== null}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                              className={`transition-colors ${
                                snapshot.isDragging
                                  ? "bg-blue-50"
                                  : "hover:bg-gray-50"
                              } ${
                                editingSubjectId === subject.id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                            >
                              {editingSubjectId === subject.id &&
                              editFormData ? (
                                <>
                                  <td className="p-4">
                                    <input
                                      type="text"
                                      value={editFormData.name}
                                      onChange={(e) =>
                                        handleEditInputChange(e, "name")
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </td>
                                  <td className="p-4 text-center">
                                    <input
                                      type="number"
                                      value={editFormData.units}
                                      onChange={(e) =>
                                        handleEditInputChange(e, "units")
                                      }
                                      min="0"
                                      step="0.5"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </td>
                                  <td className="p-4 text-center">
                                    <input
                                      type="number"
                                      value={editFormData.grade}
                                      onChange={(e) =>
                                        handleEditInputChange(e, "grade")
                                      }
                                      min="0"
                                      max="100"
                                      step="0.01"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </td>
                                  <td className="p-4 text-center font-medium">
                                    {(
                                      editFormData.grade * editFormData.units
                                    ).toFixed(2)}
                                  </td>
                                  <td className="p-4 text-center whitespace-nowrap">
                                    <button
                                      onClick={handleSaveEdit}
                                      className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors mr-2"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="p-4 font-medium text-gray-700">
                                    <div className="flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-3 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"
                                        />
                                      </svg>
                                      {subject.name}
                                    </div>
                                  </td>
                                  <td className="p-4 text-center">
                                    {subject.units}
                                  </td>
                                  <td className="p-4 text-center">
                                    {subject.grade}
                                  </td>
                                  <td className="p-4 text-center font-medium">
                                    {(subject.grade * subject.units).toFixed(2)}
                                  </td>
                                  <td className="p-4 text-center whitespace-nowrap">
                                    <button
                                      onClick={() => handleEditClick(subject)}
                                      className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors mr-2"
                                      disabled={editingSubjectId !== null}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => removeSubject(subject.id)}
                                      className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors"
                                      disabled={editingSubjectId !== null}
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="p-4 font-bold text-gray-800">Total</td>
                    <td className="p-4 text-center font-bold">
                      {subjects.reduce(
                        (sum, subject) => sum + subject.units,
                        0
                      )}
                    </td>
                    <td className="p-4"></td>
                    <td className="p-4 text-center font-bold">
                      {subjects
                        .reduce(
                          (sum, subject) => sum + subject.grade * subject.units,
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td className="p-4"></td>
                  </tr>
                </tfoot>
              </table>
            </DragDropContext>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 mb-3">No subjects added yet</p>
            <p className="text-gray-400 text-sm">
              Add subjects using the form on the left
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
