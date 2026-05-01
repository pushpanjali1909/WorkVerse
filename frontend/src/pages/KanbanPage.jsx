import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Plus, Calendar, MessageSquare } from 'lucide-react';
import { fetchTasks, updateTask } from '../redux/slices/taskSlice';
import { fetchProjects } from '../redux/slices/projectSlice';

const COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#64748B' },
  { id: 'in-progress', label: 'In Progress', color: '#06B6D4' },
  { id: 'review', label: 'Review', color: '#F59E0B' },
  { id: 'completed', label: 'Completed', color: '#22C55E' },
];

const priorityColors = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444' };

const TaskCard = ({ task, index }) => (
  <Draggable draggableId={task._id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`glass-card p-3.5 mb-2 cursor-grab active:cursor-grabbing transition-all ${snapshot.isDragging ? 'task-card-dragging' : 'hover:border-indigo-500/20'}`}
      >
        {/* Priority dot */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: priorityColors[task.priority] }} />
            <span className="text-xs capitalize" style={{ color: priorityColors[task.priority] }}>{task.priority}</span>
          </div>
          {task.projectId && (
            <span className="text-xs text-slate-500 truncate max-w-[90px]">{task.projectId.title}</span>
          )}
        </div>

        <h4 className="text-white text-sm font-medium leading-snug mb-3">{task.title}</h4>

        {task.subtasks?.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Subtasks</span>
              <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignedTo && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold" title={task.assignedTo.name}>
                {task.assignedTo.name?.[0]?.toUpperCase()}
              </div>
            )}
            {task.comments?.length > 0 && (
              <span className="flex items-center gap-1 text-slate-500 text-xs"><MessageSquare size={10} />{task.comments.length}</span>
            )}
          </div>
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-slate-500'}`}>
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    )}
  </Draggable>
);

export default function KanbanPage() {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector(s => s.tasks);
  const [selectedProject, setSelectedProject] = useState('');
  const { list: projects } = useSelector(s => s.projects);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, []);

  const filtered = selectedProject ? tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject) : tasks;

  const getColumnTasks = (status) => filtered.filter(t => t.status === status);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    dispatch(updateTask({ id: draggableId, data: { status: destination.droppableId } }));
  };

  return (
    <div className="space-y-5 h-full">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="page-title">Kanban Board</h1>
          <p className="text-slate-400 text-sm mt-1">Drag and drop tasks between columns</p>
        </div>
        <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
          className="input-field w-auto appearance-none text-sm py-2">
          <option value="" className="bg-[#0F172A]">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id} className="bg-[#0F172A]">{p.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-96 rounded-2xl" />)}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
            {COLUMNS.map(col => {
              const colTasks = getColumnTasks(col.id);
              return (
                <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col min-h-[500px]">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                      <h3 className="text-white font-semibold text-sm">{col.label}</h3>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${col.color}20`, color: col.color }}>
                        {colTasks.length}
                      </span>
                    </div>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 rounded-xl p-2 transition-colors min-h-[400px]"
                        style={{ background: snapshot.isDraggingOver ? `${col.color}08` : 'rgba(255,255,255,0.02)', border: `1px dashed ${snapshot.isDraggingOver ? col.color + '40' : 'rgba(255,255,255,0.05)'}` }}
                      >
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-24">
                            <p className="text-slate-600 text-xs">Drop tasks here</p>
                          </div>
                        )}
                        {colTasks.map((task, index) => (
                          <TaskCard key={task._id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
