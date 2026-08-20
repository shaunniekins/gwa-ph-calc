"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Subject | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const gwa = useMemo(() => {
    if (subjects.length === 0) return null;
    let totalWeightedGrade = 0;
    let totalUnits = 0;
    subjects.forEach((subject) => {
      totalWeightedGrade += subject.grade * subject.units;
      totalUnits += subject.units;
    });
    return totalWeightedGrade / totalUnits;
  }, [subjects]);

  useEffect(() => {
    const savedSubjects = localStorage.getItem("gwaSubjects");
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (e) {
        console.error("Error parsing saved subjects", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gwaSubjects", JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

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
      // Enhance UX: Return focus to name input for rapid entry
      nameInputRef.current?.focus();
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
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

  const handleExport = () => {
    const dataStr = JSON.stringify(subjects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'gwa-subjects.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            // Give each imported subject a valid format
            const processedSubjects = parsed.map(subject => ({
              ...subject,
              id: subject.id || crypto.randomUUID(),
              units: Number(subject.units) || 0,
              grade: Number(subject.grade) || 0,
            }));
            setSubjects(processedSubjects);
          }
        } catch (err) {
          alert("Invalid file format");
        }
      };
      
      // Reset input so the same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row bg-gray-50 md:overflow-hidden text-gray-800 font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-[400px] xl:w-[450px] flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white md:h-full md:overflow-y-auto shrink-0 shadow-sm z-20">
        <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col space-y-6 md:space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              GWA Calculator
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Calculate your General Weighted Average for Philippine universities.
            </p>
          </div>

          {/* GWA Result Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100/50 relative overflow-hidden transition-all hover:shadow-md">
            {/* background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 relative z-10">Current GWA</h2>
            {gwa !== null ? (
              <div className="relative z-10">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 animate-fade-in tracking-tight">
                  {gwa.toFixed(2)}
                </div>
                <p className="text-xs text-blue-600/80 font-medium mt-1">Based on {subjects.length} subjects</p>
              </div>
            ) : (
              <div className="relative z-10 flex items-center text-gray-500 text-sm italic">
                No subjects added yet.
              </div>
            )}
          </div>

          {/* Add Subject Form */}
          <div className="flex-none">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Add New Subject</h2>
            <form onSubmit={addSubject} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  id="name"
                  ref={nameInputRef}
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
                  required
                  placeholder="e.g. CS 101"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                  <input
                    type="number"
                    id="units"
                    value={newSubject.units || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, units: parseFloat(e.target.value) || 0 })}
                    min="0" step="0.5"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
                    required
                    placeholder="3.0"
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="number"
                    id="grade"
                    value={newSubject.grade || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, grade: parseFloat(e.target.value) || 0 })}
                    min="0" max="100" step="0.01"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
                    required
                    placeholder="1.00"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Subject
              </button>
            </form>
          </div>

          {/* Educational / AI Semantic Context */}
          <div className="pt-2 mt-auto hidden md:block">
            <article className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
              <h3 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">How is GWA Calculated?</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                In the Philippines, your General Weighted Average (GWA) is calculated by multiplying each subject's grade by its units, summing them all up, and dividing by your total units.
              </p>
              <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center font-mono text-[10px] text-gray-700 shadow-sm">
                GWA = Σ (Grade × Units) / Σ Units
              </div>
            </article>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-h-[500px] md:min-h-0 md:h-full bg-gray-50/50 p-4 sm:p-6 md:p-8 md:overflow-hidden">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Subjects</h2>
            {subjects.length > 0 && (
              <span className="text-xs font-bold bg-white text-blue-600 py-1 px-3 rounded-full shadow-sm border border-gray-100">
                {subjects.length} item{subjects.length !== 1 && 's'}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <label htmlFor="import-file" className="flex-1 sm:flex-none cursor-pointer bg-white text-gray-700 border border-gray-200 py-2 px-4 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-medium flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
            </label>
            <button 
              onClick={handleExport}
              disabled={subjects.length === 0}
              className={`flex-1 sm:flex-none py-2 px-4 rounded-lg transition-all text-sm font-medium flex items-center justify-center shadow-sm border ${
                subjects.length === 0 
                  ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </header>

        {/* Scrollable List Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0 relative">
          {subjects.length > 0 ? (
            <div className="overflow-y-auto flex-1">
              <DragDropContext onDragEnd={onDragEnd}>
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50/95 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Subject</th>
                      <th className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs w-24">Units</th>
                      <th className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs w-24">Grade</th>
                      <th className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs hidden sm:table-cell w-32">Weighted</th>
                      <th className="p-4 text-right font-semibold text-gray-600 uppercase tracking-wider text-xs w-32">Actions</th>
                    </tr>
                  </thead>
                  <Droppable droppableId="subjects">
                    {(provided) => (
                      <tbody {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-gray-100">
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
                                style={provided.draggableProps.style}
                                className={`group transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? "bg-blue-50/90 shadow-md ring-1 ring-blue-500/20 z-50 rounded-lg relative"
                                    : "hover:bg-gray-50/80"
                                } ${editingSubjectId === subject.id ? "bg-blue-50/50" : ""}`}
                              >
                                {editingSubjectId === subject.id && editFormData ? (
                                  <>
                                    <td className="p-3">
                                      <input type="text" value={editFormData.name} onChange={(e) => handleEditInputChange(e, "name")} className="w-full px-3 py-1.5 border border-blue-300 rounded-md shadow-inner text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </td>
                                    <td className="p-3 text-center">
                                      <input type="number" value={editFormData.units} onChange={(e) => handleEditInputChange(e, "units")} min="0" step="0.5" className="w-full px-2 py-1.5 border border-blue-300 rounded-md text-center text-sm shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </td>
                                    <td className="p-3 text-center">
                                      <input type="number" value={editFormData.grade} onChange={(e) => handleEditInputChange(e, "grade")} min="0" max="100" step="0.01" className="w-full px-2 py-1.5 border border-blue-300 rounded-md text-center text-sm shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </td>
                                    <td className="p-3 text-center font-medium text-gray-500 hidden sm:table-cell">
                                      {(editFormData.grade * editFormData.units).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right whitespace-nowrap">
                                      <div className="flex justify-end gap-1">
                                        <button onClick={handleSaveEdit} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors tooltip" title="Save">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={handleCancelEdit} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors tooltip" title="Cancel">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="p-4 font-medium text-gray-800">
                                      <div className="flex items-center">
                                        <div className="mr-3 text-gray-300 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                                        </div>
                                        {subject.name}
                                      </div>
                                    </td>
                                    <td className="p-4 text-center font-medium text-gray-600">
                                      {subject.units}
                                    </td>
                                    <td className="p-4 text-center font-medium text-gray-900 bg-gray-50/30 group-hover:bg-transparent rounded px-1">
                                      {subject.grade}
                                    </td>
                                    <td className="p-4 text-center text-gray-500 hidden sm:table-cell">
                                      {(subject.grade * subject.units).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                      <div className="flex justify-end gap-1">
                                        <button onClick={() => handleEditClick(subject)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" disabled={editingSubjectId !== null} aria-label="Edit">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => removeSubject(subject.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" disabled={editingSubjectId !== null} aria-label="Delete">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                      </div>
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
                  <tfoot className="bg-gray-50/95 backdrop-blur-sm sticky bottom-0 z-20 border-t border-gray-200">
                    <tr>
                      <td className="p-4 font-bold text-gray-800 text-right">Totals:</td>
                      <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">
                        {subjects.reduce((sum, subject) => sum + subject.units, 0)}
                      </td>
                      <td className="p-4"></td>
                      <td className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/50 hidden sm:table-cell">
                        {subjects.reduce((sum, subject) => sum + subject.grade * subject.units, 0).toFixed(2)}
                      </td>
                      <td className="p-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </DragDropContext>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
              <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border-4 border-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No subjects yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Add your classes using the form on the left to start calculating your General Weighted Average.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
